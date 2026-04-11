/**
 * 통합 데이터 파이프라인
 *
 * 새로운 연도의 날씨 데이터를 추가하는 단일 명령어.
 * 일별 캘린더 데이터 추가 + (선택) 월별 평균 재계산.
 *
 * Usage:
 *   npx tsx scripts/pipeline.ts --year 2026 --months 1-3
 *   npx tsx scripts/pipeline.ts --year 2026 --months 1-3 --only tokyo,osaka
 *   npx tsx scripts/pipeline.ts --year 2026 --months 1-3 --rebuild
 *   npx tsx scripts/pipeline.ts --year 2026 --rebuild --monthly-range 2020-2025
 */

import { execSync } from 'child_process';
import * as path from 'path';
import { countries } from './regions';

const SCRIPTS_DIR = path.dirname(new URL(import.meta.url).pathname);

/** region ID → country ID 변환 */
function regionToCountryIds(regionIds: string[]): string[] {
  const countryIds = new Set<string>();
  for (const rid of regionIds) {
    const country = countries.find((c) => c.regions.some((r) => r.id === rid));
    if (country) countryIds.add(country.id);
  }
  return [...countryIds];
}

function parseArg(name: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`))?.replace(`--${name}=`, '');
  if (eq) return eq;
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

function run(cmd: string) {
  console.log(`\n$ ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', cwd: path.join(SCRIPTS_DIR, '..') });
}

function main() {
  const yearArg = parseArg('year');
  if (!yearArg) {
    console.error('Error: --year is required (e.g. --year 2026)');
    console.error('\nUsage:');
    console.error('  npx tsx scripts/pipeline.ts --year 2026 --months 1-3');
    console.error('  npx tsx scripts/pipeline.ts --year 2026 --months 1-3 --rebuild');
    console.error('  npx tsx scripts/pipeline.ts --year 2026 --rebuild --monthly-range 2020-2025');
    process.exit(1);
  }

  const year = Number(yearArg);
  const monthsArg = parseArg('months');
  const onlyArg = parseArg('only');
  const rebuild = process.argv.includes('--rebuild');
  const monthlyRange = parseArg('monthly-range');

  console.log('='.repeat(50));
  console.log('  Travel Weather 통합 파이프라인');
  console.log('='.repeat(50));
  console.log(`  Year: ${year}`);
  console.log(`  Months: ${monthsArg ?? '1-12'}`);
  if (onlyArg) console.log(`  Only: ${onlyArg}`);
  console.log(`  Rebuild monthly: ${rebuild}`);
  if (monthlyRange) console.log(`  Monthly range: ${monthlyRange}`);
  console.log('='.repeat(50));

  // Step 1: 일별 캘린더 데이터 추가
  console.log('\n[Step 1/2] 일별 캘린더 데이터 추가');
  let dailyCmd = `npx tsx scripts/add-2025-data.ts --year ${year}`;
  if (monthsArg) dailyCmd += ` --months ${monthsArg}`;
  if (onlyArg) dailyCmd += ` --only ${onlyArg}`;
  run(dailyCmd);

  // Step 2: (선택) 월별 평균 재계산
  if (rebuild) {
    console.log('\n[Step 2/2] 월별 평균 + 여행 코멘트 + 추천 재생성');

    let startDate: string;
    let endDate: string;

    if (monthlyRange) {
      const [startYear, endYear] = monthlyRange.split('-').map(Number);
      startDate = `${startYear}-01-01`;
      endDate = `${endYear}-12-31`;
    } else {
      // 기본: 직전 5년 롤링 윈도우 (e.g. 2026 → 2021~2025)
      const endYear = year - 1;
      const startYear = endYear - 4;
      startDate = `${startYear}-01-01`;
      endDate = `${endYear}-12-31`;
    }

    let rebuildCmd = `npx tsx scripts/generate-data.ts --start-date ${startDate} --end-date ${endDate}`;
    if (onlyArg) {
      const regionIds = onlyArg.split(',').map((s) => s.trim());
      const countryIds = regionToCountryIds(regionIds);
      if (countryIds.length > 0) {
        rebuildCmd += ` --only ${countryIds.join(',')}`;
      }
    }
    run(rebuildCmd);
  } else {
    console.log('\n[Step 2/2] 월별 재계산 건너뜀 (--rebuild 플래그 없음)');
  }

  console.log('\n' + '='.repeat(50));
  console.log('  파이프라인 완료');
  console.log('='.repeat(50) + '\n');
}

main();
