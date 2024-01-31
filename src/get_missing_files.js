const fs = require('fs');
const path = require('path');
//for deleting from the client.
module.exports = async function generateMissingFileNames(folderPath, excludeFilesNames = []) {
 return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const missingFiles = excludeFilesNames
        // .filter(file => !files.some(f => path.basename(f, path.extname(f)) === file))
        .filter(file => !files.some(f => f.startsWith(`${file}______`)))
          .map(file => path.parse(file).name); // remove extension and other path
        resolve(missingFiles);
      }
    });
 });
}