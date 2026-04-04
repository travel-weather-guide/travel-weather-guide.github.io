/**
 * translate-countries.ts
 *
 * Adds ja/zh translations to:
 *  1. src/data/countries.json  — country name.ja / name.zh
 *  2. src/data/countries/{id}.json — country name + every region name + weatherSummary objects
 *
 * Run: npx tsx scripts/i18n/translate-countries.ts
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Translation tables
// ---------------------------------------------------------------------------

const COUNTRY_NAMES: Record<string, { ja: string; zh: string }> = {
  japan: { ja: "日本", zh: "日本" },
  thailand: { ja: "タイ", zh: "泰国" },
  vietnam: { ja: "ベトナム", zh: "越南" },
  philippines: { ja: "フィリピン", zh: "菲律宾" },
  indonesia: { ja: "インドネシア", zh: "印度尼西亚" },
  singapore: { ja: "シンガポール", zh: "新加坡" },
  taiwan: { ja: "台湾", zh: "台湾" },
  australia: { ja: "オーストラリア", zh: "澳大利亚" },
  france: { ja: "フランス", zh: "法国" },
  spain: { ja: "スペイン", zh: "西班牙" },
  italy: { ja: "イタリア", zh: "意大利" },
  uk: { ja: "イギリス", zh: "英国" },
  greece: { ja: "ギリシャ", zh: "希腊" },
  turkey: { ja: "トルコ", zh: "土耳其" },
  usa: { ja: "アメリカ", zh: "美国" },
};

const REGION_NAMES: Record<string, { ja: string; zh: string }> = {
  // Japan
  tokyo: { ja: "東京", zh: "东京" },
  osaka: { ja: "大阪", zh: "大阪" },
  okinawa: { ja: "沖縄", zh: "冲绳" },
  hokkaido: { ja: "北海道", zh: "北海道" },
  // Thailand
  bangkok: { ja: "バンコク", zh: "曼谷" },
  "chiang-mai": { ja: "チェンマイ", zh: "清迈" },
  phuket: { ja: "プーケット", zh: "普吉岛" },
  // France
  paris: { ja: "パリ", zh: "巴黎" },
  nice: { ja: "ニース", zh: "尼斯" },
  // USA
  "new-york": { ja: "ニューヨーク", zh: "纽约" },
  "los-angeles": { ja: "ロサンゼルス", zh: "洛杉矶" },
  hawaii: { ja: "ハワイ", zh: "夏威夷" },
  // Australia
  sydney: { ja: "シドニー", zh: "悉尼" },
  melbourne: { ja: "メルボルン", zh: "墨尔本" },
  // Vietnam
  hanoi: { ja: "ハノイ", zh: "河内" },
  "ho-chi-minh": { ja: "ホーチミン", zh: "胡志明市" },
  "da-nang": { ja: "ダナン", zh: "岘港" },
  // Philippines
  manila: { ja: "マニラ", zh: "马尼拉" },
  boracay: { ja: "ボラカイ", zh: "长滩岛" },
  cebu: { ja: "セブ", zh: "宿务" },
  // Singapore
  singapore: { ja: "シンガポール", zh: "新加坡" },
  // Indonesia
  bali: { ja: "バリ", zh: "巴厘岛" },
  lombok: { ja: "ロンボク", zh: "龙目岛" },
  jakarta: { ja: "ジャカルタ", zh: "雅加达" },
  // Taiwan
  taipei: { ja: "台北", zh: "台北" },
  kaohsiung: { ja: "高雄", zh: "高雄" },
  // Spain
  madrid: { ja: "マドリード", zh: "马德里" },
  barcelona: { ja: "バルセロナ", zh: "巴塞罗那" },
  seville: { ja: "セビリア", zh: "塞维利亚" },
  // Italy
  rome: { ja: "ローマ", zh: "罗马" },
  venice: { ja: "ベネチア", zh: "威尼斯" },
  amalfi: { ja: "アマルフィ", zh: "阿马尔菲" },
  // UK
  london: { ja: "ロンドン", zh: "伦敦" },
  edinburgh: { ja: "エディンバラ", zh: "爱丁堡" },
  // Turkey
  istanbul: { ja: "イスタンブール", zh: "伊斯坦布尔" },
  cappadocia: { ja: "カッパドキア", zh: "卡帕多西亚" },
  antalya: { ja: "アンタルヤ", zh: "安塔利亚" },
  // Greece
  athens: { ja: "アテネ", zh: "雅典" },
  santorini: { ja: "サントリーニ", zh: "圣托里尼" },
  mykonos: { ja: "ミコノス", zh: "米科诺斯" },
};

const WEATHER_SUMMARIES: Record<
  string,
  { ko: string; en: string; ja: string; zh: string }
> = {
  추움: { ko: "추움", en: "Cold", ja: "寒い", zh: "寒冷" },
  쌀쌀: { ko: "쌀쌀", en: "Chilly", ja: "肌寒い", zh: "微冷" },
  온화: { ko: "온화", en: "Mild", ja: "温暖", zh: "温和" },
  따뜻: { ko: "따뜻", en: "Warm", ja: "暖かい", zh: "温暖" },
  더움: { ko: "더움", en: "Hot", ja: "暑い", zh: "炎热" },
  쾌청: { ko: "쾌청", en: "Clear", ja: "快晴", zh: "晴朗" },
  "따뜻하고 쾌청": {
    ko: "따뜻하고 쾌청",
    en: "Warm & Clear",
    ja: "暖かく快晴",
    zh: "温暖晴朗",
  },
  우기: { ko: "우기", en: "Rainy season", ja: "雨季", zh: "雨季" },
  "습하고 비 잦음": {
    ko: "습하고 비 잦음",
    en: "Humid & Rainy",
    ja: "蒸し暑く雨が多い",
    zh: "潮湿多雨",
  },
  혹한: { ko: "혹한", en: "Freezing", ja: "厳寒", zh: "严寒" },
  "서늘하고 비 잦음": {
    ko: "서늘하고 비 잦음",
    en: "Cool & Rainy",
    ja: "涼しく雨が多い",
    zh: "凉爽多雨",
  },
  "건조하고 더움": {
    ko: "건조하고 더움",
    en: "Dry & Hot",
    ja: "乾燥して暑い",
    zh: "干燥炎热",
  },
  선선: { ko: "선선", en: "Cool", ja: "涼しい", zh: "凉爽" },
  "맑고 더움": {
    ko: "맑고 더움",
    en: "Sunny & Hot",
    ja: "晴れて暑い",
    zh: "晴热",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function translateName(
  name: { ko: string; en: string },
  translations: { ja: string; zh: string }
): { ko: string; en: string; ja: string; zh: string } {
  return { ko: name.ko, en: name.en, ja: translations.ja, zh: translations.zh };
}

function translateWeatherSummary(
  summary: string | { ko: string; en: string; ja: string; zh: string }
): { ko: string; en: string; ja: string; zh: string } {
  // Already translated — return as-is
  if (typeof summary === "object") return summary;

  const mapped = WEATHER_SUMMARIES[summary];
  if (!mapped) {
    console.warn(`  [WARN] Unknown weatherSummary: "${summary}" — keeping as-is`);
    return { ko: summary, en: summary, ja: summary, zh: summary };
  }
  return mapped;
}

// ---------------------------------------------------------------------------
// Step 1: Update countries.json
// ---------------------------------------------------------------------------

function updateCountriesIndex(indexPath: string): void {
  console.log(`Updating ${indexPath} ...`);

  const countries = readJson(indexPath) as Array<{
    id: string;
    name: { ko: string; en: string; ja?: string; zh?: string };
    [key: string]: unknown;
  }>;

  const updated = countries.map((country) => {
    const translations = COUNTRY_NAMES[country.id];
    if (!translations) {
      console.warn(`  [WARN] No country name translation for id="${country.id}"`);
      return country;
    }
    return {
      ...country,
      name: translateName(
        { ko: country.name.ko, en: country.name.en },
        translations
      ),
    };
  });

  writeJson(indexPath, updated);
  console.log(`  Written: ${indexPath}`);
}

// ---------------------------------------------------------------------------
// Step 2: Update each country detail file
// ---------------------------------------------------------------------------

type MonthlyData = {
  month: number;
  weatherSummary:
    | string
    | { ko: string; en: string; ja: string; zh: string };
  [key: string]: unknown;
};

type Region = {
  id: string;
  name: { ko: string; en: string; ja?: string; zh?: string };
  climateType: string;
  monthlyData: MonthlyData[];
  [key: string]: unknown;
};

type CountryDetail = {
  id: string;
  name: { ko: string; en: string; ja?: string; zh?: string };
  regions: Region[];
  [key: string]: unknown;
};

function updateCountryDetail(filePath: string): void {
  const country = readJson(filePath) as CountryDetail;
  console.log(`Updating ${path.basename(filePath)} ...`);

  // Update country name
  const countryTranslations = COUNTRY_NAMES[country.id];
  if (!countryTranslations) {
    console.warn(`  [WARN] No translation for country id="${country.id}"`);
  } else {
    country.name = translateName(
      { ko: country.name.ko, en: country.name.en },
      countryTranslations
    );
  }

  // Update each region
  country.regions = country.regions.map((region) => {
    const regionTranslations = REGION_NAMES[region.id];
    if (!regionTranslations) {
      console.warn(`  [WARN] No translation for region id="${region.id}"`);
    } else {
      region.name = translateName(
        { ko: region.name.ko, en: region.name.en },
        regionTranslations
      );
    }

    // Update each month's weatherSummary
    region.monthlyData = region.monthlyData.map((month) => ({
      ...month,
      weatherSummary: translateWeatherSummary(month.weatherSummary),
    }));

    return region;
  });

  writeJson(filePath, country);
  console.log(`  Written: ${filePath}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const dataDir = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../../src/data"
  );

  const indexPath = path.join(dataDir, "countries.json");
  const countriesDir = path.join(dataDir, "countries");

  // Step 1
  updateCountriesIndex(indexPath);

  // Step 2
  const files = fs
    .readdirSync(countriesDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  for (const file of files) {
    updateCountryDetail(path.join(countriesDir, file));
  }

  console.log("\nDone. All files updated successfully.");
}

main();
