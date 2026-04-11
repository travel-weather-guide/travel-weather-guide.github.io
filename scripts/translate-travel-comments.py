#!/usr/bin/env python3
"""
travel-comments + monthly-recommendations JSON 자동 번역 스크립트
- 한국어(ko) → 영어(en), 일본어(ja), 중국어 간체(zh)
- deep-translator (Google Translate 무료) 사용
- 구분자 합치기 기법으로 대량 텍스트를 한 번에 번역 (10x 속도 향상)
- 고유 텍스트 캐시로 중복 번역 제거 (~82% 중복률)
- 3개 언어 병렬 번역 (ThreadPoolExecutor)

Usage:
  python3 scripts/translate-travel-comments.py                # 전체 번역
  python3 scripts/translate-travel-comments.py --only japan    # 특정 국가만
  python3 scripts/translate-travel-comments.py --dry-run       # 실제 저장 안 함
  python3 scripts/translate-travel-comments.py --review        # 의심스러운 번역만 추출 → review.json
"""

import json
import os
import re
import sys
import time
import argparse
import warnings
from pathlib import Path
from typing import Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

warnings.filterwarnings("ignore", category=UserWarning)

from deep_translator import GoogleTranslator

# ── 설정 ──────────────────────────────────────────────
DATA_DIR = Path(__file__).parent.parent / "src" / "data"
COMMENTS_DIR = DATA_DIR / "travel-comments"
RECOMMENDATIONS_DIR = DATA_DIR / "monthly-recommendations"
TARGET_LANGS = {"en": "en", "ja": "ja", "zh": "zh-CN"}
BATCH_SIZE = 25            # 구분자 합치기 시 한 번에 보낼 텍스트 수
BATCH_DELAY = 0.5          # 배치 사이 딜레이 (초)
MAX_RETRIES = 3
RETRY_DELAY = 3

SEP = " ||| "              # 구분자 (번역기가 유지하는 패턴)

STRING_FIELDS = ["summary", "clothingAdvice"]
ARRAY_FIELDS = ["highlights", "cautions", "events", "tips"]


# ── 후처리: Google Translate 반복 오역 보정 ──────────────
# 번역 후 자동 적용되는 보정 규칙. 새 패턴 발견 시 여기에 추가.

# 소수 숫자 패턴: "월 X.Y일 비가 와 야외 일정에 유의" → Google이 소수를 날짜로 분리
# 한국어 원문의 소수를 반올림하여 올바른 번역으로 교체
DECIMAL_RAINY_PATTERN_KO = re.compile(r'월\s+(\d+\.\d+)일\s+비가\s+와\s+야외\s+일정에\s+유의')

def _fix_decimal_rainy(ko: str, translated: str, lang: str) -> str:
    """소수 강수일수 오역 보정: '월 16.4일 비가 와...' 패턴."""
    m = DECIMAL_RAINY_PATTERN_KO.search(ko)
    if not m:
        return translated
    rounded = round(float(m.group(1)))
    if lang == "en":
        return f"About {rounded} rainy days per month, plan outdoor activities accordingly"
    elif lang == "zh":
        return f"月均约{rounded}天降雨，注意安排户外行程"
    elif lang == "ja":
        return f"月約{rounded}日雨が降るため、屋外の予定に注意"
    return translated

# 일본어 고유명사·음차 보정 (wrong → correct)
JA_REPLACEMENTS = {
    "最適機": "最適期",                        # 機(기계) → 期(시기)
    "チェ・ソンシギ": "ピークシーズン",           # 최성수기 음차
    "ブームビーム": "大混雑",                    # 붐빔 음차
    "バリウッド": "ボリウッド",                   # Bollywood
    "フランバナン": "プランバナン",               # Prambanan
    "チョン・チャンウォン": "正倉院",             # 정창원 (奈良)
    "クッケンホフ": "キューケンホフ",             # Keukenhof
    "イスラムヘレス": "イスラ・ムヘーレス",       # Isla Mujeres
    "ペリア・デ": "フェリア・デ",                 # Feria de
    "ヘネラリペ": "ヘネラリフェ",                 # Generalife
    "セツバル": "セトゥーバル",                   # Setúbal
    "ヴェネツィアビーチ": "ベニスビーチ",         # Venice Beach (LA)
    "マグカップ": "穏やかな波",                   # 잔잔 오역
}

def _fix_ja_known(translated: str) -> str:
    """일본어 반복 오역 보정."""
    for wrong, correct in JA_REPLACEMENTS.items():
        if wrong in translated:
            translated = translated.replace(wrong, correct)
    return translated

def post_translate_fix(ko: str, translated: str, lang: str) -> str:
    """번역 후처리: 알려진 오역 패턴 자동 보정."""
    translated = _fix_decimal_rainy(ko, translated, lang)
    if lang == "ja":
        translated = _fix_ja_known(translated)
    return translated


# ── 1단계: 모든 고유 텍스트 수집 ─────────────────────
def collect_unique_texts(comment_files: list[Path], rec_files: list[Path]) -> set[str]:
    """모든 파일에서 번역 필요한 고유 한국어 텍스트 수집."""
    texts = set()

    # travel-comments: summary, clothingAdvice, highlights, cautions, events, tips
    for fp in comment_files:
        entries = json.loads(fp.read_text("utf-8"))
        for entry in entries:
            for field in STRING_FIELDS:
                v = entry.get(field, "")
                if isinstance(v, str) and v.strip():
                    texts.add(v.strip())
            for field in ARRAY_FIELDS:
                v = entry.get(field, [])
                if isinstance(v, list):
                    for item in v:
                        if isinstance(item, str) and item.strip():
                            texts.add(item.strip())

    # monthly-recommendations: bestDestinations[].reason, hiddenGems[].reason, avoidList[].reason
    for fp in rec_files:
        data = json.loads(fp.read_text("utf-8"))
        for section in ["bestDestinations", "hiddenGems", "avoidList"]:
            for item in data.get(section, []):
                v = item.get("reason", "")
                if isinstance(v, str) and v.strip():
                    texts.add(v.strip())

    return texts


# ── 2단계: 배치 번역 (구분자 합치기) ─────────────────
def translate_batch_joined(texts: list[str], target_lang_code: str) -> dict[str, str]:
    """여러 텍스트를 구분자로 합쳐 한 번에 번역 후 분리. {원문: 번역} 딕셔너리 반환."""
    result = {}
    translator = GoogleTranslator(source="ko", target=target_lang_code)

    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i + BATCH_SIZE]
        joined = SEP.join(batch)

        for attempt in range(MAX_RETRIES):
            try:
                translated = translator.translate(joined)
                if translated is None:
                    # 실패 시 원문 유지
                    for t in batch:
                        result[t] = t
                    break

                parts = [p.strip() for p in translated.split("|||")]

                # 구분자 분리 결과가 원본과 수가 다르면 개별 번역으로 폴백
                if len(parts) != len(batch):
                    for t in batch:
                        try:
                            r = translator.translate(t)
                            result[t] = r if r else t
                            time.sleep(0.3)
                        except Exception:
                            result[t] = t
                else:
                    for orig, trans in zip(batch, parts):
                        result[orig] = trans

                time.sleep(BATCH_DELAY)
                break
            except Exception as e:
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAY * (attempt + 1))
                else:
                    print(f"    [!] 배치 실패 ({target_lang_code}), 원문 유지: {e}")
                    for t in batch:
                        result[t] = t

        # 진행 표시
        done = min(i + BATCH_SIZE, len(texts))
        print(f"    {target_lang_code}: {done}/{len(texts)}", end="\r", flush=True)

    print(f"    {target_lang_code}: {len(texts)}/{len(texts)} 완료")
    return result


def translate_all_unique(unique_texts: set[str]) -> dict[str, dict[str, str]]:
    """고유 텍스트를 3개 언어로 병렬 번역. {원문: {en: ..., ja: ..., zh: ...}} 반환."""
    texts_list = sorted(unique_texts)  # 정렬해서 재현 가능하게
    translation_map: dict[str, dict[str, str]] = {t: {} for t in texts_list}

    print(f"\n  고유 텍스트 {len(texts_list)}개를 3개 언어로 번역 중...")

    # 3개 언어 병렬 실행
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {}
        for json_key, lang_code in TARGET_LANGS.items():
            future = executor.submit(translate_batch_joined, texts_list, lang_code)
            futures[future] = json_key

        for future in as_completed(futures):
            json_key = futures[future]
            try:
                lang_result = future.result()
                for text, translated in lang_result.items():
                    # 후처리: 알려진 오역 패턴 자동 보정
                    translation_map[text][json_key] = post_translate_fix(text, translated, json_key)
            except Exception as e:
                print(f"  [!] {json_key} 번역 실패: {e}")

    return translation_map


# ── 3단계: 번역 결과를 JSON에 적용 ───────────────────
def apply_translations(file_path: Path, translation_map: dict[str, dict[str, str]], dry_run: bool) -> int:
    """파일에 번역 결과 적용. 변경된 필드 수 반환."""
    entries = json.loads(file_path.read_text("utf-8"))
    changed = 0

    for entry in entries:
        # string 필드
        for field in STRING_FIELDS:
            v = entry.get(field, "")
            if isinstance(v, str) and v.strip() in translation_map:
                t = translation_map[v.strip()]
                entry[field] = {"ko": v, "en": t.get("en", v), "ja": t.get("ja", v), "zh": t.get("zh", v)}
                changed += 1

        # array 필드
        for field in ARRAY_FIELDS:
            v = entry.get(field, [])
            if not isinstance(v, list) or len(v) == 0:
                continue
            # 이미 번역된 경우 스킵
            if isinstance(v, dict):
                continue
            if len(v) > 0 and isinstance(v[0], dict):
                continue

            ko_list = v
            en_list, ja_list, zh_list = [], [], []
            for item in ko_list:
                t = translation_map.get(item.strip(), {}) if isinstance(item, str) else {}
                en_list.append(t.get("en", item))
                ja_list.append(t.get("ja", item))
                zh_list.append(t.get("zh", item))

            entry[field] = {"ko": ko_list, "en": en_list, "ja": ja_list, "zh": zh_list}
            changed += 1

    if not dry_run and changed > 0:
        file_path.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return changed


# ── monthly-recommendations 번역 적용 ─────────────────
def apply_translations_recommendations(file_path: Path, translation_map: dict[str, dict[str, str]], dry_run: bool) -> int:
    """monthly-recommendations 파일에 번역 결과 적용."""
    data = json.loads(file_path.read_text("utf-8"))
    changed = 0

    for section in ["bestDestinations", "hiddenGems", "avoidList"]:
        for item in data.get(section, []):
            v = item.get("reason", "")
            if isinstance(v, str) and v.strip() in translation_map:
                t = translation_map[v.strip()]
                item["reason"] = {"ko": v, "en": t.get("en", v), "ja": t.get("ja", v), "zh": t.get("zh", v)}
                changed += 1

    if not dry_run and changed > 0:
        file_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return changed


# ── 번역 품질 검증 (--review) ─────────────────────────
def is_suspicious(ko: str, translated: str, lang: str) -> Optional[str]:
    """의심스러운 번역을 탐지. 사유 문자열 반환, 정상이면 None."""

    # 1) 소수점 숫자 보존 체크: "16.4일" 같은 소수가 번역에서 분리되면 오역
    ko_decimals = re.findall(r'\d+\.\d+', ko)
    tr_decimals = re.findall(r'\d+\.\d+', translated)
    for n in ko_decimals:
        if n not in tr_decimals:
            return f"소수 숫자 변형: {n}"

    # °C, mm, % 등 단위 숫자는 번역에도 숫자가 있어야 함 (단위 표기는 달라도 OK)
    ko_units = re.findall(r'(\d+)(?:°C|mm|%)', ko)
    tr_all_nums = re.findall(r'\d+', translated)
    for n in ko_units:
        if n not in tr_all_nums:
            return f"단위 숫자 누락: {n}"

    # 2) 한글이 번역에 남아있으면 이상
    if lang in ("en", "ja", "zh") and re.search(r'[가-힣]', translated):
        if lang == "en":
            return "영어에 한글 잔존"
        return f"{lang} 번역에 한글 잔존"

    # 3) 번역이 원문과 동일 (번역 안 된 것)
    if translated == ko:
        return "번역 안 됨 (원문 동일)"

    # 4) 일본어: 한국어 음차 의심 (카타카나 + ・ + 카타카나 = 한국어를 음차한 패턴)
    if lang == "ja" and re.search(r'[\u30A0-\u30FF]{2,}・[\u30A0-\u30FF]{2,}', translated):
        return "일본어 한국어 음차 의심"

    # 5) 원문 ko와 번역 ja의 의미 비교 — 원문에 한자어/고유명사가 없는데
    #    일본어에 음차 패턴이 2개 이상이면 의심 (チェ・ソンシギ 같은 케이스)
    if lang == "ja":
        dot_groups = re.findall(r'[\u30A0-\u30FF]{2,}・[\u30A0-\u30FF]{2,}(?:・[\u30A0-\u30FF]{2,})*', translated)
        if len(dot_groups) >= 2:
            return f"일본어 다중 음차 의심: {', '.join(dot_groups)}"

    # 4) 길이 비율 이상 — 한→영은 3~4배 정상, 5배 이상만 잡음. 한→중/일은 비슷해야 함
    ratio = len(translated) / max(len(ko), 1)
    if lang == "en" and ratio > 5:
        return f"번역 과도하게 김 (x{ratio:.1f})"
    if lang in ("ja", "zh") and ratio > 3:
        return f"번역 과도하게 김 (x{ratio:.1f})"
    if len(ko) > 8 and ratio < 0.2:
        return f"번역 과도하게 짧음 (x{ratio:.1f})"

    return None


def run_review():
    """번역된 파일을 스캔하여 의심 항목만 review.json으로 추출."""
    issues = []

    # travel-comments 스캔
    for fp in sorted(COMMENTS_DIR.glob("*.json")):
        entries = json.loads(fp.read_text("utf-8"))
        for entry in entries:
            ctx = f"{fp.stem}/{entry.get('regionId','?')}/{entry.get('month','?')}월"
            for field in STRING_FIELDS:
                v = entry.get(field)
                if not isinstance(v, dict) or "ko" not in v:
                    continue
                ko = v["ko"]
                for lang in ["en", "ja", "zh"]:
                    tr = v.get(lang, "")
                    reason = is_suspicious(ko, tr, lang)
                    if reason:
                        issues.append({"where": ctx, "field": field, "lang": lang, "ko": ko, "translated": tr, "issue": reason})

            for field in ARRAY_FIELDS:
                v = entry.get(field)
                if not isinstance(v, dict) or "ko" not in v:
                    continue
                ko_list = v["ko"]
                for lang in ["en", "ja", "zh"]:
                    tr_list = v.get(lang, [])
                    for i, (ko_item, tr_item) in enumerate(zip(ko_list, tr_list)):
                        reason = is_suspicious(ko_item, tr_item, lang)
                        if reason:
                            issues.append({"where": ctx, "field": f"{field}[{i}]", "lang": lang, "ko": ko_item, "translated": tr_item, "issue": reason})

    # monthly-recommendations 스캔
    for fp in sorted(RECOMMENDATIONS_DIR.glob("*.json")):
        data = json.loads(fp.read_text("utf-8"))
        for section in ["bestDestinations", "hiddenGems", "avoidList"]:
            for item in data.get(section, []):
                v = item.get("reason")
                if not isinstance(v, dict) or "ko" not in v:
                    continue
                ctx = f"recommendations/{fp.stem}/{section}/{item.get('regionId','?')}"
                ko = v["ko"]
                for lang in ["en", "ja", "zh"]:
                    tr = v.get(lang, "")
                    reason = is_suspicious(ko, tr, lang)
                    if reason:
                        issues.append({"where": ctx, "field": "reason", "lang": lang, "ko": ko, "translated": tr, "issue": reason})

    # 결과 저장
    out_path = Path(__file__).parent / "translation-review.json"
    out_path.write_text(json.dumps(issues, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"검증 완료: {len(issues)}건 의심 항목")
    print(f"  → {out_path}")

    # 요약
    if issues:
        from collections import Counter
        by_issue = Counter(i["issue"].split(":")[0] for i in issues)
        by_lang = Counter(i["lang"] for i in issues)
        print(f"\n  유형별: {dict(by_issue)}")
        print(f"  언어별: {dict(by_lang)}")
    else:
        print("  문제 없음!")

    return issues


# ── 메인 ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Travel comments 한→영/일/중 자동 번역")
    parser.add_argument("--only", type=str, help="특정 국가만 번역 (예: japan)")
    parser.add_argument("--dry-run", action="store_true", help="실제 저장 안 하고 카운트만")
    parser.add_argument("--review", action="store_true", help="번역 품질 검증 → translation-review.json 생성")
    args = parser.parse_args()

    if args.review:
        run_review()
        return

    comment_files = sorted(COMMENTS_DIR.glob("*.json"))
    rec_files = sorted(RECOMMENDATIONS_DIR.glob("*.json"))

    if args.only:
        comment_files = [f for f in comment_files if f.stem == args.only]
        if not comment_files:
            print(f"[!] {args.only}.json not found")
            sys.exit(1)
        rec_files = []  # --only는 travel-comments 전용

    print(f"{'[DRY RUN] ' if args.dry_run else ''}번역 대상: travel-comments {len(comment_files)}개 + monthly-recommendations {len(rec_files)}개")
    print(f"언어: ko -> en, ja, zh")
    print("=" * 60)

    start_time = time.time()

    # 1) 고유 텍스트 수집 (두 종류 파일 모두)
    unique_texts = collect_unique_texts(comment_files, rec_files)
    print(f"  고유 텍스트: {len(unique_texts)}개")

    # 2) 번역 (3개 언어 병렬)
    translation_map = translate_all_unique(unique_texts)

    # 3) travel-comments 파일에 적용
    print(f"\n  [travel-comments] 적용 중...")
    total_changed = 0
    for fp in comment_files:
        changed = apply_translations(fp, translation_map, args.dry_run)
        total_changed += changed
        status = f"{changed}개 필드 변경" if changed > 0 else "스킵 (이미 번역됨)"
        print(f"  {fp.stem}: {status}")

    # 4) monthly-recommendations 파일에 적용
    if rec_files:
        print(f"\n  [monthly-recommendations] 적용 중...")
        for fp in rec_files:
            changed = apply_translations_recommendations(fp, translation_map, args.dry_run)
            total_changed += changed
            status = f"{changed}개 reason 변경" if changed > 0 else "스킵 (이미 번역됨)"
            print(f"  {fp.stem}: {status}")

    elapsed = time.time() - start_time
    print("\n" + "=" * 60)
    print(f"완료! {elapsed:.1f}초 소요")
    print(f"  고유 텍스트: {len(unique_texts)}개")
    print(f"  변경 필드: {total_changed}개")
    print(f"  대상 파일: {len(comment_files) + len(rec_files)}개")


if __name__ == "__main__":
    main()
