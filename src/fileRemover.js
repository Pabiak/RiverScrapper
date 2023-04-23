import fs from 'fs';

const filePaths = ['../selectedRiverFiles', '../charts', '../files'];

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
    console.log("Previous files have been deleted");
    resolve();
  });
};
