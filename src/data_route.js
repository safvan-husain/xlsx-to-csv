const express = require("express");
const fs = require("fs");
const path = require("path");
const ensureDirectoryExists = require("./directory_creator.js");
const generate_download_links = require("./generate_download_links.js");
const dataRoute = express.Router();
const generateMissingFileNames = require("./get_missing_files.js");
const MyRemoteSql = require("./db/mysql_helper.js");

let myRemoteSqlInstance = MyRemoteSql.getInstance();

dataRoute.post("/data", async (req, res) => {
  const agencyId = req.body.agencyId;
  const receivedFiles = req.body.filenames;

  try {
    var links = await generate_download_links(
      ensureDirectoryExists(`../csv_files/${agencyId}`),
      receivedFiles
    );
    var deleted = await generateMissingFileNames(
      ensureDirectoryExists(`../csv_files/${agencyId}`),
      Object.keys(receivedFiles)
    );

    res.status(200).json({ missingFiles: links, deleted: deleted });
  } catch (error) {
    console.log(error);
    console.log("error updating data");
    res.status(500).json({ message: "Error updating data" });
  }
});

dataRoute.post("/delete", async (req, res) => {
  const agencyId = req.body.agencyId;
  const filename = req.body.filename;

  try {
    myRemoteSqlInstance.deleteAllOfaSingleAgencyFile(agencyId, filename);
    // Ensure the directory exists
    const dir = path.join(__dirname, "..", "csv_files", agencyId);
    if (!fs.existsSync(dir)) {
      return  res.status(200).json({ message: "Files deleted successfully." });
    }

    const filesInDir = fs.readdirSync(dir);

    // Delete file
    const matchingFiles = filesInDir.filter((file) =>
      file.startsWith(`${filename}_____`)
    );
    for (let matchingFile of matchingFiles) {
      const filePath = path.join(dir, matchingFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ message: "Files deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the files." });
  }
});

module.exports = { dataRoute };
