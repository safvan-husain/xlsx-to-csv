const fs = require("fs");
const path = require("path");

module.exports = function ensureDirectoryExists(folderPath) {
    const dir = path.join(__dirname, folderPath);
  
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
  
    return dir;
  }