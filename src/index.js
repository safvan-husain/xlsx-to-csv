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
const { dataRoute } = require('./data_route.js');
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());
app.use(dataRoute)

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Hello World new!");
});

app.post("/upload", express.json(), async (req, res) => {
  console.log("Links received");
  console.time("Total Time");

  const fileLinks = req.body.fileLinks; // Assuming the payload has a `fileLinks` array
  const agencyId = req.body.agencyId;
  if (fileLinks && fileLinks.length > 0) {
    // console.log(fileLinks);
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
          const filename = path.basename(fileLink, '.xlsx');
          // const filename = uuidv4() + path.extname(fileLink);
          // const filepath = path.join(__dirname, 'uploads', filename);
          const filepath =
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

        //     // Perform operations on the downloaded file here
        //     // ...
      }
      res.status(200).send("Congrats, files downloaded and processed");
    } catch (error) {
      console.error("Error downloading files:", error);
      res.status(500).send("Error downloading files");
    }

    // Get all files in the directory
    const files = fs.readdirSync(
      ensureDirectoryExists(`../uploads/${agencyId}/`)
    );
    for (const file of files) {
      const filePath = path.join(
        ensureDirectoryExists(`../uploads/${agencyId}/`),
        file
      );
      // Call your async function here
      try {
        await xlsxToCsv(filePath, file, agencyId);
        console.log(`${filePath} coverted successfully`);
        fs.unlinkSync(filePath);
      } catch (err) {
        console.log(`error converting ${filePath}`);

        console.log(err);
      }

      // Delete the file
    }
    // try {
    //   var links = await generateDownloadLinks(
    //     ensureDirectoryExists(`../csv_files/${agencyId}`)
    //   );
    //   console.log(links);
    //   for (const link of links) {
    //     let data = {
    //       link: link,
    //       del: agencyId,
    //     };
    //     try {
    //       var res = await axios.post(
    //         link,
    //         data
    //       );
    //     } catch (error) {
    //       console.log(error);
    //       console.log("upoload link failed");
    //     }
    //   }
    //   console.log(links);
    // } catch (error) {
    //   console.log(error);
    //   console.log('error generating links');
    // }
   
    // await sendFiles(ensureDirectoryExists(`../csv_files/${agencyId}`));
  } else {
    res.status(400).json({ message: "No file links provided" });
  }

  console.timeEnd("Total Time");
});



app.timeout = 300000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
