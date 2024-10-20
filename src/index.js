const express = require("express");
// const { parse } = require("json2csv");
const app = express();
const multer = require("multer");
const xlsxToCsv = require("./covertXlsxToCsv.js");
const sendFiles = require("./send_files.js");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path"); 
const cors = require("cors"); 
const { log } = require("console");
const axios = require("axios");
const ensureDirectoryExists = require("./directory_creator.js");
const generateDownloadLinks = require("./generate_download_links.js");
const { dataRoute } = require("./data_route.js");
const dotenv = require("dotenv");
const MyRemoteSql = require("./db/mysql_helper.js");
const { json } = require("body-parser");
const { copy_file } = require("./copy_file.js");
const database = MyRemoteSql.getInstance();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());
app.use(dataRoute);

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Hello World new!");
});


app.get("/download/:filename", (req, res) => {
  const filePath =  req.params.filename;
  res.download(filePath, (err) => {
      if (err) {
          res.status(500).send({
              error: err,
              msg: "Problem downloading the file"
          });
      }
  });
});

app.post("/upload2", express.json(), async (req, res) => {
  console.log("Links received");
  console.time("Total Time");

  const fileLinks = req.body.fileLinks; // Assuming the payload has a `fileLinks` array
  const agencyId = req.body.agencyId;
  if (fileLinks && fileLinks.length > 0) {
    // console.log(fileLinks);
    let filepath;
    let filename;
    try {
      for (const fileLink of fileLinks) {
        // Download each file
        try {
          
          // Create a unique filename for the downloaded file
          filename = path.basename(fileLink, ".xlsx");
          
          filepath =
          ensureDirectoryExists(`../uploads/${agencyId}/`) + filename;
          
          await copy_file(`/var/www/recovery.starkinhost.com/${fileLink}`, filepath);
     

        
        } catch (error) {
          if (error.code === "ECONNRESET") {
            console.log("Connection reset by peer");
          } else {
            console.error("Error copying file:", error);
          }
        }
      }
      res.status(200).send("Congrats, files downloaded and processed");
    } catch (error) {
      console.error("Error downloading files:", error);
      res.status(500).send("Error downloading files");
    }

    try {
      await xlsxToCsv(filepath, filename, agencyId);
      console.log(`${filepath} coverted successfully`);
      fs.unlinkSync(filepath);
    } catch (err) {
      console.log(`error converting ${filepath}`);

      console.log(err);
    }
  } else {
    res.status(400).json({ message: "No file links provided" });
  }

  console.timeEnd("Total Time");
});
app.post("/upload", express.json(), async (req, res) => {
  console.log("Links received");
  console.time("Total Time");

  const fileLinks = req.body.fileLinks; // Assuming the payload has a `fileLinks` array
  const agencyId = req.body.agencyId;
  if (fileLinks && fileLinks.length > 0) {
    // console.log(fileLinks);
    let filepath;
    let filename;
    try {
      for (const fileLink of fileLinks) {
        // Download each file
        try {
          const response = await axios({
            method: "GET",
            url: `https://www.recovery.starkinsolutions.com/${fileLink}`,
            responseType: "stream",
            timeout: 60000,
          });
          // Create a unique filename for the downloaded file
          filename = path.basename(fileLink, ".xlsx");

          filepath =
            ensureDirectoryExists(`../uploads/${agencyId}/`) + filename;

          // Stream the file to the filesystem
          const writer = fs.createWriteStream(filepath);
          response.data.pipe(writer);

          try {
            await new Promise((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            });
          } catch (error) {
            console.log(`error saving ${fileLink}`);
            console.log(error);
          }
        } catch (error) {
          if (error.code === "ECONNRESET") {
            console.log("Connection reset by peer");
          } else {
            console.error("Error downloading file:", error);
          }
        }
      }
      res.status(200).send("Congrats, files downloaded and processed");
    } catch (error) {
      console.error("Error downloading files:", error);
      res.status(500).send("Error downloading files");
    }

    try {
      await xlsxToCsv(filepath, filename, agencyId);
      console.log(`${filepath} coverted successfully`);
      fs.unlinkSync(filepath);
    } catch (err) {
      console.log(`error converting ${filepath}`);

      console.log(err);
    }
  } else {
    res.status(400).json({ message: "No file links provided" });
  }

  console.timeEnd("Total Time");
});

app.post("/search-vn", async (req, res) => {
  const { vehicleNumber, agencyId } = req.body;
  try {
    var data = await database.getDataByVehicleNumber(vehicleNumber, agencyId);

    res.status(200).json(data.map((e) => JSON.parse(e.details)));
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/search-cn", async (req, res) => {
  const { chassiNumber, agencyId } = req.body;
  try {
    var data = await database.getDataByChassiNumber(chassiNumber, agencyId);

    res.status(200).json(data.map((e) => JSON.parse(e.details)));
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.post("/delete-vn", async (req, res) => {
  const { vehicleNumber, agencyId } = req.body;

  try {
    await database.deleteMatchingRecordsWithVehicleNo(vehicleNumber, agencyId);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
app.post("/delete-cn", async (req, res) => {
  const { chassiNumber, agencyId } = req.body;
  try {
    await database.deleteMatchingRecordsWithChassiNo(chassiNumber, agencyId);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.timeout = 1000000;

app.listen(port, async () => {
  await database.initialize();
  //  database.logAllDataFromTable();
  console.log(`Server listening at http://localhost:${port}`);
});
