const fs = require("fs");


async function copy_file(sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    // Create a read stream from the source file
    const readStream = fs.createReadStream(sourcePath);

    // Create a write stream to the destination file
    const writeStream = fs.createWriteStream(destinationPath);

    // Pipe the read stream to the write stream
    readStream.pipe(writeStream);

    // Handle errors
    readStream.on("error", (err) => {
      console.error("Error reading file:", err);
      reject(err);
    });

    writeStream.on("error", (err) => {
      console.error("Error writing file:", err);
      reject(err);
    });

    // Log success message when the file is successfully copied
    writeStream.on("finish", () => {
      console.log("File copied successfully");
      resolve();
    });
  });
}

module.exports = { copy_file };
