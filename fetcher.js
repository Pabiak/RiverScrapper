const fs = require("fs");
const { promisify } = require("util");

const stations = {
  152200020: "Trzciniec",
  152200120: "Borkowo",
};
const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const years = ["2015", "2016", "2017"];
const folderPath = "./files";

const selectedFiles = fs.readdirSync(folderPath).filter((filename) => {
  const regex = /^codz_([0-9]{4})_([0-9]{2}).csv$/;
  const match = regex.exec(filename);
  return match && years.includes(match[1]) && months.includes(match[2]);
});

const readFileAsync = promisify(fs.readFile);

const getYearFromFilename = (filename) => {
  const regex = /^codz_([0-9]{4})_[0-9]{2}.csv$/;
  const match = regex.exec(filename);
  if (match) {
    return match[1];
  }
  return null;
};

const stationKeys = Object.keys(stations);

stationKeys.forEach(async (station) => {
  const filteredDataByYear = {};
  for (const file of selectedFiles) {
    const year = getYearFromFilename(file);
    if (!year) continue;

    try {
      const data = await fs.promises.readFile(`${folderPath}/${file}`, "utf-8");
      const lines = data.split("\n");
      const rivers = lines.filter((line) => {
        return getRiverDataById(line, station);
      });

      if (!filteredDataByYear[year]) {
        filteredDataByYear[year] = [];
      }

      filteredDataByYear[year].push(...rivers);

      if (file === selectedFiles[selectedFiles.length - 1]) {
        saveToFile(station, filteredDataByYear);
      }
    } catch (err) {
      console.log(err);
    }
  }
});

const getRiverDataById = (line, id) => {
  if (!line.includes(id)) return;
  return line;
};

const saveToFile = (stationID, filteredDataByYear) => {
  const stationName = stations[stationID];
  Object.entries(filteredDataByYear).forEach(([year, data]) => {
    const filename = `./outputFiles/${year}_${stationName}.csv`;
    const fileData = data.join("\n");
    //console.log(fileData);
    fs.writeFile(filename, fileData, (err) => {
      if (err) throw err;
      console.log(
        `Dane dla stacji ${stationName} z roku ${year} zostały zapisane do pliku ${filename}.`
      );
    });
  });
};
