import fs from 'fs';

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
    Object.entries(filteredDataByYear).forEach(([year, data]) => {
      const filename = `./outputFiles/${year}_${stationName}.csv`;
      const fileData = data.join("\n");
      fs.writeFile(filename, fileData, (err) => {
        if (err) throw err;
        console.log(
          `Dane dla stacji ${stationName} z roku ${year} zostały zapisane do pliku ${filename}.`
        );
      });
    });
  };
export default {getYearFromFilename, getRiverDataById, saveToFile};
  