import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'daily');

for (let month = 1; month <= 12; month++) {
  const filePath = path.join(DATA_DIR, `${month}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const region of data.regions) {
    const regionDir = path.join(DATA_DIR, region.regionId);
    if (!fs.existsSync(regionDir)) {
      fs.mkdirSync(regionDir, { recursive: true });
    }

    const regionData = {
      regionId: region.regionId,
      regionName: region.regionName,
      countryId: region.countryId,
      month: data.month,
      years: region.years,
    };

    fs.writeFileSync(
      path.join(regionDir, `${month}.json`),
      JSON.stringify(regionData, null, 2)
    );
  }

  console.log(`Month ${month}: split into ${data.regions.length} region files`);
}

console.log('Done. Region directories created in src/data/daily/');
