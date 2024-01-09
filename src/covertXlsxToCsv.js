const XlsxStreamReader = require("xlsx-stream-reader");
const createCsvWriter = require("csv-writer").createArrayCsvWriter;
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const ensureDirectoryExists = require("./directory_creator.js");
const getMemoryUsage = require('./get_memory_usage.js')

module.exports = async function xlsxToCsv(inputFilePath, fileName,agencyId) {
  getMemoryUsage();
  return new Promise((resolve, reject) => {
    var workBookReader = new XlsxStreamReader();

    workBookReader.on("error", function (error) {
      reject(error);
    });

    var worksheetId = 0;

    workBookReader.on("worksheet", function (workSheetReader) {

      worksheetId++;
      // if (workSheetReader.id > 1) {
      //   // we only want first sheet
      //   workSheetReader.skip();
      //   return;
      // }
      let csvWriter;

      var titles = [];
      let records = [];
      var isTitleStored = false;

      var path = `${ensureDirectoryExists(
        `../csv_files/${agencyId}`
      )}/${fileName}_______id${worksheetId}.csv`;
      workSheetReader.on("row", async function (row) {
        if (!isTitleStored) {
          titles = row.values;
          csvWriter = createCsvWriter({
            header: titles,
            path: path,
          });
          isTitleStored = true;
        } else {
          records.push(row.values);
        }
      });

      workSheetReader.on("end", async function () {
        await csvWriter.writeRecords(records);
        console.log(workSheetReader.rowCount);
        records = [];
      });

      // call process after registering handlers
      workSheetReader.process();
    });

    workBookReader.on("end", function () {
      resolve();
    });

    fs.createReadStream(inputFilePath).pipe(workBookReader);
  });
};

// streamReadExcel(
//   "C:\\Users\\safva\\OneDrive\\Desktop\\starkin_projects\\excel_convert\\data.xlsx"
// );
