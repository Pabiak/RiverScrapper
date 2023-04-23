import fs from 'fs';
import { getCharts } from './chartGenerator.js';
import {downloadAndExtractFiles} from './fileDownloader.js';
import { deleteFiles } from './filesRemover.js';
import config from './config.json' assert { type: "json" };
const getYearFromFilename = (filename) => {
  const regex = /^codz_([0-9]{4})_[0-9]{2}.csv$/;
  const match = regex.exec(filename);
  if (match) {
    return match[1];
  }
  return null;
};

const getRiverDataById = (line, id) => {
  if (!line.includes(id)) return;
  return line;
};

const saveToFile = (stationID, filteredDataByYear, stations) => {
  const stationName = stations[stationID];
  const promises = Object.entries(filteredDataByYear).map(([year, data]) => {
    const filename = `./outputFiles/${year}_${stationName}.csv`;
    const fileData = data.join("\n");
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, fileData, (err) => {
        if (err) reject(err);
        console.log(
          `Dane dla stacji ${stationName} z roku ${year} zostały zapisane do pliku ${filename}.`
        );
        resolve(filename);
      });
    });
  });
  return Promise.all(promises);
};

const stations = config.stations;

const months = config.months;

const years = config.years;
const folderPath = './files';

await deleteFiles();
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
