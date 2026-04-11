import * as fs from "fs";
import * as path from "path";

// Translation dictionaries
const CLIMATE_TYPE_MAP: Record<
  string,
  { en: string; ja: string; zh: string }
> = {
  "냉대 대륙성": {
    en: "Subarctic continental",
    ja: "亜寒帯大陸性",
    zh: "亚寒带大陆性",
  },
  "냉대 습윤": { en: "Humid continental", ja: "冷帯湿潤", zh: "冷带湿润" },
  "반건조 대륙성": {
    en: "Semi-arid continental",
    ja: "半乾燥大陸性",
    zh: "半干旱大陆性",
  },
  "사막 건조": { en: "Desert arid", ja: "砂漠性乾燥", zh: "沙漠干燥" },
  "산악 기후": { en: "Alpine", ja: "高山気候", zh: "高山气候" },
  "산악 해양성": {
    en: "Alpine oceanic",
    ja: "山岳海洋性",
    zh: "高山海洋性",
  },
  "서안 해양성": { en: "Oceanic", ja: "西岸海洋性", zh: "温带海洋性" },
  아열대: { en: "Subtropical", ja: "亜熱帯", zh: "亚热带" },
  "아열대 몬순": {
    en: "Subtropical monsoon",
    ja: "亜熱帯モンスーン",
    zh: "亚热带季风",
  },
  "아열대 습윤": {
    en: "Humid subtropical",
    ja: "温暖湿潤",
    zh: "亚热带湿润",
  },
  "아열대 해양성": {
    en: "Subtropical oceanic",
    ja: "亜熱帯海洋性",
    zh: "亚热带海洋性",
  },
  열대: { en: "Tropical", ja: "熱帯", zh: "热带" },
  "열대 몬순": {
    en: "Tropical monsoon",
    ja: "熱帯モンスーン",
    zh: "热带季风",
  },
  "열대 사바나": {
    en: "Tropical savanna",
    ja: "熱帯サバナ",
    zh: "热带草原",
  },
  "열대 우림": {
    en: "Tropical rainforest",
    ja: "熱帯雨林",
    zh: "热带雨林",
  },
  "열대 해양성": {
    en: "Tropical oceanic",
    ja: "熱帯海洋性",
    zh: "热带海洋性",
  },
  "온대 대륙성": {
    en: "Temperate continental",
    ja: "温帯大陸性",
    zh: "温带大陆性",
  },
  "온대 습윤": { en: "Humid temperate", ja: "温帯湿潤", zh: "温带湿润" },
  "온대 해양성": {
    en: "Temperate oceanic",
    ja: "温帯海洋性",
    zh: "温带海洋性",
  },
  지중해성: { en: "Mediterranean", ja: "地中海性", zh: "地中海型" },
  "지중해성 반건조": {
    en: "Semi-arid Mediterranean",
    ja: "半乾燥地中海性",
    zh: "半干旱地中海型",
  },
  "한대 해양성": {
    en: "Subpolar oceanic",
    ja: "寒帯海洋性",
    zh: "寒带海洋性",
  },
};

const WEATHER_SUMMARY_MAP: Record<
  string,
  { en: string; ja: string; zh: string }
> = {
  "따뜻하고 쾌청": { en: "Warm & clear", ja: "暖かく快晴", zh: "温暖晴朗" },
  "맑고 더움": { en: "Clear & hot", ja: "晴れて暑い", zh: "晴热" },
  "습하고 비 잦음": {
    en: "Humid & rainy",
    ja: "蒸し暑く雨が多い",
    zh: "潮湿多雨",
  },
  쌀쌀: { en: "Chilly", ja: "肌寒い", zh: "微凉" },
  온화: { en: "Mild", ja: "温暖", zh: "温和" },
  우기: { en: "Rainy season", ja: "雨季", zh: "雨季" },
  추움: { en: "Cold", ja: "寒い", zh: "寒冷" },
  쾌청: { en: "Clear", ja: "快晴", zh: "晴朗" },
  혹한: { en: "Freezing", ja: "極寒", zh: "严寒" },
};

interface MonthlyData {
  month: number;
  weatherSummary: string | { ko: string; en: string; ja: string; zh: string };
  [key: string]: unknown;
}

interface Region {
  id: string;
  climateType: string | { ko: string; en: string; ja: string; zh: string };
  monthlyData: MonthlyData[];
  [key: string]: unknown;
}

interface CountryData {
  regions: Region[];
  [key: string]: unknown;
}

const COUNTRIES_DIR = path.join(
  "/Users/hh/Desktop/dev/travel-weather",
  "src",
  "data",
  "countries"
);

let totalFiles = 0;
let totalClimateUpdates = 0;
let totalSummaryUpdates = 0;
const unknownClimates = new Set<string>();
const unknownSummaries = new Set<string>();

const files = fs
  .readdirSync(COUNTRIES_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

for (const file of files) {
  const filePath = path.join(COUNTRIES_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: CountryData = JSON.parse(raw);

  let fileClimateUpdates = 0;
  let fileSummaryUpdates = 0;

  for (const region of data.regions) {
    // Translate climateType
    if (typeof region.climateType === "string") {
      const ko = region.climateType;
      const translations = CLIMATE_TYPE_MAP[ko];
      if (translations) {
        region.climateType = { ko, ...translations };
        fileClimateUpdates++;
      } else {
        unknownClimates.add(ko);
      }
    }

    // Translate weatherSummary in each monthlyData entry
    for (const entry of region.monthlyData) {
      if (typeof entry.weatherSummary === "string") {
        const ko = entry.weatherSummary;
        const translations = WEATHER_SUMMARY_MAP[ko];
        if (translations) {
          entry.weatherSummary = { ko, ...translations };
          fileSummaryUpdates++;
        } else {
          unknownSummaries.add(ko);
        }
      }
    }
  }

  if (fileClimateUpdates > 0 || fileSummaryUpdates > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(
      `  ${file}: ${fileClimateUpdates} climateType(s), ${fileSummaryUpdates} weatherSummary(s) translated`
    );
    totalFiles++;
    totalClimateUpdates += fileClimateUpdates;
    totalSummaryUpdates += fileSummaryUpdates;
  } else {
    console.log(`  ${file}: (no changes)`);
  }
}

console.log("\n--- Summary ---");
console.log(`Files updated:          ${totalFiles}`);
console.log(`climateType updates:    ${totalClimateUpdates}`);
console.log(`weatherSummary updates: ${totalSummaryUpdates}`);

if (unknownClimates.size > 0) {
  console.log(`\nWARN: Unknown climateType values (not translated):`);
  for (const v of unknownClimates) console.log(`  - "${v}"`);
}
if (unknownSummaries.size > 0) {
  console.log(`\nWARN: Unknown weatherSummary values (not translated):`);
  for (const v of unknownSummaries) console.log(`  - "${v}"`);
}
