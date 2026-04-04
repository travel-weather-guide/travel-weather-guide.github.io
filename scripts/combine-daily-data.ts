import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'daily');

const regionDirs = fs.readdirSync(DATA_DIR).filter((f) => {
  return fs.statSync(path.join(DATA_DIR, f)).isDirectory();
});

for (const regionId of regionDirs) {
  const regionDir = path.join(DATA_DIR, regionId);
  const combined: Record<number, { years: Record<string, unknown[]> }> = {};

  for (let month = 1; month <= 12; month++) {
    const filePath = path.join(regionDir, `${month}.json`);
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    combined[month] = { years: data.years };
  }

  fs.writeFileSync(
    path.join(regionDir, 'all.json'),
    JSON.stringify(combined)
  );

  const size = fs.statSync(path.join(regionDir, 'all.json')).size;
  console.log(`${regionId}/all.json: ${(size / 1024).toFixed(1)}KB`);
}
