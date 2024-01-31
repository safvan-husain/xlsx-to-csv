const fs = require('fs');
const path = require('path');

module.exports = async function generateDownloadLinks(folderPath, map = {}) {
  var excludeFiles = [];
  for(let key in map) {
    for (let index = 1; index <= map[key]; index++) {
      excludeFiles.push(`${key}______id${index}`);      
    }
  }
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        console.log(files);
        console.log(excludeFiles);
        const downloadLinks = files
          .filter(file => !excludeFiles.includes(path.basename(file, '.csv')))  
          // .filter(file => !excludeFiles.some(excludeFile => file.startsWith(excludeFile)))
          .map(file => path.join(folderPath, file)); 
        resolve(downloadLinks);
      }
    });
  });
}
