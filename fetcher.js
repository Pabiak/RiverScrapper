const fs = require("fs");
const filteredData = [];

const id1 = "152200020";
const id2 = "152200120";

const folderPath = "./files";
const files = fs.readdirSync(folderPath);

files.forEach((file) => {
  fs.readFile(`${folderPath}/${file}`, "utf-8", (err, data) => {
    if (err) console.log(err);
    const lines = data.split("\n");
    lines.forEach((line) => {
      if (line.includes(id1) || line.includes(id2)) {
        filteredData.push(line);
      }
    });

    if (files.indexOf(file) === files.length - 1) {
      saveToFile();
    }
  });
});

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
