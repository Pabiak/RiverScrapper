import fs from "fs";

const filePaths = ["./outputFiles", "./charts", "./files"];
for(const filePath of filePaths){
  fs.readdir(filePath, (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
      fs.unlink(`${filePath}/${file}`, (err) => {
        if (err) console.log(err);
      });
    }
  });
}
