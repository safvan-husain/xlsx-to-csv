const XlsxStreamReader = require("xlsx-stream-reader");
const createCsvWriter = require("csv-writer").createArrayCsvWriter;
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const ensureDirectoryExists = require("./directory_creator.js");
const getMemoryUsage = require("./get_memory_usage.js");
const MyRemoteSql = require("./db/mysql_helper.js");

const database = MyRemoteSql.getInstance();

module.exports = async function xlsxToCsv(inputFilePath, fileName, agencyId) {
  getMemoryUsage();
  let count = 0;
  return new Promise((resolve, reject) => {
    var workBookReader = new XlsxStreamReader();

    workBookReader.on("error", function (error) {
      reject(error);
    });

    var worksheetId = 0;

    workBookReader.on("worksheet", function (workSheetReader) {
      worksheetId++;
      let csvWriter;

      var titles = [];
      let records = [];
      var isTitleStored = false;
      var isCalledEnd = false;

      var path = `${ensureDirectoryExists(
        `../csv_files/${agencyId}`
      )}/${fileName}______id${worksheetId}.csv`;
      workSheetReader.on("row", function (row) {
        count++;
        if (!isTitleStored) {
          // console.log(row.values.length);
          // console.log(worksheetId);

          titles = row.values.map((str) => {
            if (str === undefined || str === null) {
              str = "";
            } else {
              str = String(str);
            }
            return str
              .toLowerCase()
              .replaceAll("\n", "")
              .replaceAll("\r", "")
              .replaceAll(".", "");
          });
          // console.log(titles);
          csvWriter = createCsvWriter({
            header: titles,
            path: path,
          });
          isTitleStored = true;
        } else {
          if (records.length > 1000) {
            database.addRecords(records, titles, agencyId, fileName);
            csvWriter.writeRecords(records);
            records = [];
            worksheetId++;
            path = `${ensureDirectoryExists(
              `../csv_files/${agencyId}`
            )}/${fileName}______id${worksheetId}.csv`;
            csvWriter = createCsvWriter({
              header: titles,
              path: path,
            });
          }
          let currentRow = row.values.map((str) => {
            if (str === undefined || str === null) {
              str = "";
            } else {
              str = String(str);
            }
            // if(str.includes("/")) {
            // }
            return str.toLowerCase().replaceAll("\n", "").replaceAll("\r", "");
          });

          records.push(currentRow);
        }
      });

      workSheetReader.on("end", async function () {
        if (csvWriter === undefined) {
          if (records > 0) {
            csvWriter = createCsvWriter({
              header: titles,
              path: path,
            });
            database.addRecords(records, titles, agencyId, fileName);
            csvWriter.writeRecords(records);
            records = [];
          }
        } else {
          database.addRecords(records, titles, agencyId, fileName);
          csvWriter.writeRecords(records);
          records = [];
        }
      });

      // call process after registering handlers
      workSheetReader.process();
    });

    workBookReader.on("end", function () {
      console.log(`completed with ${count}`);
      resolve();
    });

    fs.createReadStream(inputFilePath).pipe(workBookReader);
  });
};
