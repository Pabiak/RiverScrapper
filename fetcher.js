import fs from 'fs';
import { getCharts } from './chartGenerator.js';
import {
  getYearFromFilename,
  getRiverDataById,
  saveToFile,
} from './helpers.js';
import { downloadAndExtractFiles } from './fileDownloader.js';
const stations = {
  152200020: 'Trzciniec',
  152200120: 'Borkowo',
};

const months = [
  '11',
  '12',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
];

const years = ['2015', '2016', '2017'];
const folderPath = './files';

await downloadAndExtractFiles(years, months);

const fileData = fs
  .readdirSync(folderPath)
  .map((filename) => {
    const regex = /^codz_([0-9]{4})_([0-9]{2}).csv$/;
    const match = regex.exec(filename);

    if (match && years.includes(match[1]) && months.includes(match[2])) {
      return {
        filename,
        year: match[1],
        month: match[2],
      };
    }

    return null;
  })
  .filter(Boolean)
  .sort((a, b) => {
    if (a.year === b.year) {
      return months.indexOf(a.month) - months.indexOf(b.month);
    }

    return a.year - b.year;
  });

const selectedFiles = fileData.map((file) => file.filename);
const stationKeys = Object.keys(stations);

stationKeys.forEach(async (station) => {
  const filteredDataByYear = {};
  const filteredDataAllYears = {};
  const allYearsTitle = years.join(',');

  for (const file of selectedFiles) {
    const year = getYearFromFilename(file);
    if (!year) continue;

    try {
      const data = await fs.promises.readFile(`${folderPath}/${file}`, 'utf-8');
      const lines = data.split('\n');
      const rivers = lines.filter((line) => getRiverDataById(line, station));

      if (!filteredDataByYear[year]) {
        filteredDataByYear[year] = [];
      }

      if (!filteredDataAllYears[allYearsTitle]) {
        filteredDataAllYears[allYearsTitle] = [];
      }

      filteredDataByYear[year].push(...rivers);
      filteredDataAllYears[allYearsTitle].push(...rivers);

      if (file === selectedFiles[selectedFiles.length - 1]) {
        saveToFile(station, filteredDataByYear, stations)
          .then((filenames) => getCharts(filenames))
          .catch((err) => console.error('Wystąpił błąd:', err));
      }
    } catch (err) {
      console.log(err);
    }
  }

  saveToFile(station, filteredDataAllYears, stations)
    .then((filenames) => getCharts(filenames))
    .catch((err) =>
      console.error('Wystąpił błąd podczas zapisu wszystkich lat:', err)
    );
});
