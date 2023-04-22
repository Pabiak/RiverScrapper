import https from 'https';
import fs from 'fs';
import unzipper from 'unzipper';

const path = './files';

export const downloadAndExtractFiles = async (years, months) => {
  for (const year of years) {
    for (const month of months) {
      const fileName = `codz_${year}_${month}.zip`;
      const fileUrl = `https://danepubliczne.imgw.pl/data/dane_pomiarowo_obserwacyjne/dane_hydrologiczne/dobowe/${year}/codz_${year}_${month}.zip`;
      
      await new Promise((resolve, reject) => {
        https.get(fileUrl, (response) => {
          response.pipe(fs.createWriteStream(fileName)).on('finish', () => {
            resolve();
          });
        }).on('error', (err) => {
          reject(err);
        });
      });

      await new Promise((resolve, reject) => {
        fs.createReadStream(fileName)
          .pipe(unzipper.Extract({ path: path }))
          .on('finish', () => {
            console.log(`Finished extracting files from ${fileName}.`);
            fs.unlink(fileName, (err) => {
              if (err) {
                reject(err);
              } else {
                console.log(`Deleted ${fileName}`);
                resolve();
              }
            });
          })
          .on('error', (err) => {
            reject(err);
          });
      });
    }
  }
};
