import fs from 'fs';

const filePaths = ['./outputFiles', './charts', './files'];

export const deleteFiles = async () => {
  await new Promise((resolve, reject) => {
    for (const filePath of filePaths) {
      fs.readdir(filePath, (err, files) => {
        if (err) {
          console.log(err);
          reject();
        }
        for (const file of files) {
          fs.unlink(`${filePath}/${file}`, (err) => {
            if (err) console.log(err);
            reject();
          });
        }
      });
    }
    console.log("Files have been deleted");
    resolve();
  });
};
