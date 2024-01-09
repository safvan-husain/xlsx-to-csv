const fs = require('fs');
const path = require('path');

module.exports = async function generateDownloadLinks(folderPath, excludeFiles = []) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const downloadLinks = files
          .filter(file => !excludeFiles.includes(path.basename(file, '.csv')))  
          .map(file => path.join(folderPath, file)); 
        resolve(downloadLinks);
      }
    });
  });
}
