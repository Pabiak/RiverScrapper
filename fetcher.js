const fs = require("fs");
const filteredData = [];

const stations = ["152200020", "152200120"]
const months = ['11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
const years = ['2015', '2016', '2017']
const folderPath = "./files";
const files = fs.readdirSync(folderPath);


files.forEach((file) => {
  fs.readFile(`${folderPath}/${file}`, "utf-8", (err, data) => {

    if (err) console.log(err);
    const lines = data.split("\n");

    filteredData.push(lines.filter((line) => {
      return getRiverDataById(line, stations[0]) || getRiverDataById(line, stations[1]);
    }));

    if (files.indexOf(file) === files.length - 1) {
      saveToFile();
    }

  });
});

const getRiverDataById = (line, id) => {
  if (!line.includes(id)) return;
  return line;
}

const saveToFile = () => {
  const output = filteredData.join("\n");
  fs.writeFile("./filteredData.csv", output, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Saved");
  });
}
