/**
 * translate-climate-types.ts
 *
 * Converts climateType from a plain Korean string to a { ko, en, ja, zh } object
 * for every region in all 15 country JSON files under src/data/countries/.
 *
 * Run: npx tsx scripts/i18n/translate-climate-types.ts
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Translation table
// ---------------------------------------------------------------------------

const CLIMATE_TYPES: Record<
  string,
  { ko: string; en: string; ja: string; zh: string }
> = {
  "온대 습윤": { ko: "온대 습윤", en: "Humid Temperate", ja: "温帯湿潤", zh: "温带湿润" },
  "열대 사바나": { ko: "열대 사바나", en: "Tropical Savanna", ja: "熱帯サバナ", zh: "热带草原" },
  "서안 해양성": { ko: "서안 해양성", en: "Oceanic", ja: "西岸海洋性", zh: "温带海洋性" },
  "지중해성": { ko: "지중해성", en: "Mediterranean", ja: "地中海性", zh: "地中海型" },
  "냉대 습윤": { ko: "냉대 습윤", en: "Humid Continental", ja: "冷帯湿潤", zh: "温带大陆湿润" },
  "아열대": { ko: "아열대", en: "Subtropical", ja: "亜熱帯", zh: "亚热带" },
  "열대 몬순": { ko: "열대 몬순", en: "Tropical Monsoon", ja: "熱帯モンスーン", zh: "热带季风" },
  "아열대 습윤": { ko: "아열대 습윤", en: "Humid Subtropical", ja: "亜熱帯湿潤", zh: "亚热带湿润" },
  "열대 우림": { ko: "열대 우림", en: "Tropical Rainforest", ja: "熱帯雨林", zh: "热带雨林" },
  "반건조 대륙성": { ko: "반건조 대륙성", en: "Semi-arid Continental", ja: "半乾燥大陸性", zh: "半干旱大陆性" },
  "지중해성 반건조": { ko: "지중해성 반건조", en: "Semi-arid Mediterranean", ja: "地中海性半乾燥", zh: "半干旱地中海型" },
  "온대 해양성": { ko: "온대 해양성", en: "Temperate Maritime", ja: "温帯海洋性", zh: "温带海洋性" },
  "아열대 몬순": { ko: "아열대 몬순", en: "Subtropical Monsoon", ja: "亜熱帯モンスーン", zh: "亚热带季风" },
  "열대": { ko: "열대", en: "Tropical", ja: "熱帯", zh: "热带" },
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

type ClimateTypeValue =
  | string
  | { ko: string; en: string; ja?: string; zh?: string };

function translateClimateType(
  value: ClimateTypeValue
): { ko: string; en: string; ja: string; zh: string } {
  if (typeof value === "object") return value as { ko: string; en: string; ja: string; zh: string };

  const mapped = CLIMATE_TYPES[value];
  if (!mapped) {
    console.warn(`  [WARN] Unknown climateType: "${value}" — keeping as plain string object`);
    return { ko: value, en: value, ja: value, zh: value };
  }
  return mapped;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

type Region = {
  id: string;
  climateType: ClimateTypeValue;
  [key: string]: unknown;
};

type CountryDetail = {
  id: string;
  regions: Region[];
  [key: string]: unknown;
};

function updateCountryDetail(filePath: string): void {
  const country = readJson(filePath) as CountryDetail;
  console.log(`Updating ${path.basename(filePath)} ...`);

  country.regions = country.regions.map((region) => ({
    ...region,
    climateType: translateClimateType(region.climateType),
  }));

  writeJson(filePath, country);
  console.log(`  Written: ${filePath}`);
}

function main(): void {
  const dataDir = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../../src/data"
  );
  const countriesDir = path.join(dataDir, "countries");

  const files = fs
    .readdirSync(countriesDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  for (const file of files) {
    updateCountryDetail(path.join(countriesDir, file));
  }

  console.log("\nDone. All climateType fields updated successfully.");
}

main();
