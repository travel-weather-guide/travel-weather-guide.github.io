import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const PUBLIC_DIR = path.resolve(__dirname, "../public");
const OG_DIR = path.join(PUBLIC_DIR, "og");

// Ensure output directories exist
fs.mkdirSync(OG_DIR, { recursive: true });

// ─────────────────────────────────────────────
// A. Favicon conversion
// ─────────────────────────────────────────────

const FALLBACK_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <circle cx="16" cy="16" r="16" fill="#0284c7"/>
  <circle cx="14" cy="13" r="5" fill="#fbbf24"/>
  <line x1="14" y1="5" x2="14" y2="3" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="20.2" y1="6.8" x2="21.6" y2="5.4" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="13" x2="24" y2="13" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="6" y1="13" x2="4" y2="13" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="7.8" y1="6.8" x2="6.4" y2="5.4" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="9" y="18" width="16" height="8" rx="4" fill="white"/>
  <circle cx="13" cy="18" r="4" fill="white"/>
  <circle cx="19" cy="17" r="5" fill="white"/>
</svg>`;

async function generateFavicons() {
  const faviconSvgPath = path.join(PUBLIC_DIR, "favicon.svg");
  const svgBuffer = fs.existsSync(faviconSvgPath)
    ? fs.readFileSync(faviconSvgPath)
    : Buffer.from(FALLBACK_FAVICON_SVG);

  // favicon.ico — 32x32 PNG saved as .ico (browsers accept PNG in .ico)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon.ico"));
  console.log("  favicon.ico (32x32)");

  // apple-touch-icon.png — 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  console.log("  apple-touch-icon.png (180x180)");
}

// ─────────────────────────────────────────────
// B. Default OG image
// ─────────────────────────────────────────────

function buildDefaultOgSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Subtle grid overlay -->
  <rect width="1200" height="630" fill="white" fill-opacity="0.03"/>
  <!-- Logo icon (sun + cloud simplified) -->
  <circle cx="140" cy="280" r="60" fill="#fbbf24" fill-opacity="0.9"/>
  <ellipse cx="170" cy="340" rx="80" ry="30" fill="white" fill-opacity="0.85"/>
  <ellipse cx="120" cy="348" rx="45" ry="28" fill="white" fill-opacity="0.85"/>
  <!-- Title -->
  <text x="260" y="295" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="700" fill="white" letter-spacing="-2">Travel Weather</text>
  <!-- Subtitle -->
  <text x="262" y="370" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="400" fill="white" fill-opacity="0.85">여행하기 좋은 날씨, 한눈에</text>
  <!-- Bottom line -->
  <rect x="260" y="415" width="120" height="4" rx="2" fill="white" fill-opacity="0.5"/>
</svg>`;
}

async function generateDefaultOg() {
  const svg = buildDefaultOgSvg();
  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(PUBLIC_DIR, "og-default.png"));
  console.log("  og-default.png (1200x630)");
}

// ─────────────────────────────────────────────
// C. Country OG images
// ─────────────────────────────────────────────

type Continent = "asia" | "europe" | "north-america" | "oceania" | "africa" | "south-america";

interface CountryMeta {
  id: string;
  nameKo: string;
  nameEn: string;
  continent: Continent;
}

// countries.json에서 동적으로 로드
const countriesJsonPath = path.resolve(__dirname, "../src/data/countries.json");
const COUNTRIES: CountryMeta[] = JSON.parse(fs.readFileSync(countriesJsonPath, "utf-8")).map(
  (c: { id: string; name: { ko: string; en: string }; continent: Continent }) => ({
    id: c.id,
    nameKo: c.name.ko,
    nameEn: c.name.en,
    continent: c.continent,
  })
);

// Gradient colors per continent
const CONTINENT_GRADIENTS: Record<Continent, [string, string]> = {
  "asia":          ["#0ea5e9", "#0369a1"],   // sky
  "europe":        ["#6366f1", "#3730a3"],   // indigo
  "north-america": ["#10b981", "#065f46"],   // emerald
  "oceania":       ["#14b8a6", "#0f766e"],   // teal
  "africa":        ["#f59e0b", "#b45309"],   // amber
  "south-america": ["#ec4899", "#9d174d"],   // pink
};

function buildCountryOgSvg(country: CountryMeta): string {
  const [colorStart, colorEnd] = CONTINENT_GRADIENTS[country.continent];
  // Clamp nameEn font size for long names
  const enFontSize = country.nameEn.length > 18 ? 36 : 42;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${colorStart}"/>
      <stop offset="100%" stop-color="${colorEnd}"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Decorative circle -->
  <circle cx="1050" cy="100" r="260" fill="white" fill-opacity="0.05"/>
  <circle cx="150"  cy="530" r="180" fill="white" fill-opacity="0.05"/>
  <!-- Country name (Korean) -->
  <text x="600" y="270" font-family="Arial, Helvetica, sans-serif" font-size="110" font-weight="700" fill="white" text-anchor="middle" letter-spacing="-2">${country.nameKo}</text>
  <!-- Country name (English) -->
  <text x="600" y="348" font-family="Arial, Helvetica, sans-serif" font-size="${enFontSize}" font-weight="400" fill="white" fill-opacity="0.8" text-anchor="middle">${country.nameEn}</text>
  <!-- Divider -->
  <rect x="520" y="385" width="160" height="3" rx="1.5" fill="white" fill-opacity="0.4"/>
  <!-- Brand -->
  <text x="600" y="440" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="400" fill="white" fill-opacity="0.7" text-anchor="middle">Travel Weather</text>
  <!-- Tagline -->
  <text x="600" y="480" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="white" fill-opacity="0.55" text-anchor="middle">여행하기 좋은 날씨, 한눈에</text>
</svg>`;
}

async function generateCountryOgs() {
  for (const country of COUNTRIES) {
    const svg = buildCountryOgSvg(country);
    const outPath = path.join(OG_DIR, `${country.id}.png`);
    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .png()
      .toFile(outPath);
    console.log(`  og/${country.id}.png`);
  }
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// D. Country thumbnails + JSON update
// ─────────────────────────────────────────────

const THUMB_DIR = path.join(PUBLIC_DIR, "thumbnails");
fs.mkdirSync(THUMB_DIR, { recursive: true });

function buildThumbnailSvg(country: CountryMeta): string {
  const [colorStart, colorEnd] = CONTINENT_GRADIENTS[country.continent];
  const koFontSize = country.nameKo.length > 4 ? 42 : 52;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="600" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${colorStart}"/>
      <stop offset="100%" stop-color="${colorEnd}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg)"/>
  <circle cx="480" cy="80" r="120" fill="white" fill-opacity="0.06"/>
  <circle cx="100" cy="350" r="90" fill="white" fill-opacity="0.06"/>
  <text x="300" y="185" font-family="Arial, Helvetica, sans-serif" font-size="${koFontSize}" font-weight="700" fill="white" text-anchor="middle">${country.nameKo}</text>
  <text x="300" y="235" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" fill="white" fill-opacity="0.75" text-anchor="middle">${country.nameEn}</text>
  <rect x="250" y="260" width="100" height="2" rx="1" fill="white" fill-opacity="0.35"/>
</svg>`;
}

async function generateThumbnails() {
  for (const country of COUNTRIES) {
    const svg = buildThumbnailSvg(country);
    const outPath = path.join(THUMB_DIR, `${country.id}.png`);
    await sharp(Buffer.from(svg)).resize(600, 400).png().toFile(outPath);
    console.log(`  thumbnails/${country.id}.png`);
  }
}

// imageUrl은 generate-data.ts에서 Unsplash URL로 관리 — 여기서 덮어쓰지 않음

async function main() {
  console.log("\n[generate-images] Starting...\n");

  console.log("Favicons:");
  await generateFavicons();

  console.log("\nDefault OG:");
  await generateDefaultOg();

  console.log("\nCountry OG images:");
  await generateCountryOgs();

  console.log("\nCountry thumbnails:");
  await generateThumbnails();

  console.log("\n[generate-images] Done.\n");
}

main().catch((err) => {
  console.error("[generate-images] Error:", err);
  process.exit(1);
});
