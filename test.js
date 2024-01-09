const XLSX = require("xlsx");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");

function btoaUrl(str){
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
 }
 
 var username = btoaUrl('starkina_recovery');
 var password = btoaUrl('t7Oug+e7r)NZ');
 var hostname = btoaUrl('localhost'); 
var uri = 'mysql://' + username + ':' + password + '@' + hostname + '/starkina_recovery';
 



async function convertXlsxToCsvM(inputFilePath) {
  // Read the XLSX file
  const workbook = XLSX.readFile(inputFilePath);
  const sheetNameList = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

  // Create a connection to the MySQL server
//   const connection = mysql.createConnection(uri); 
  const connection = mysql.createConnection({
    host: "85.187.128.49" , 
    // host: "192.168.107.67",
    user: "starkina_test", 
    password: "H[FlB$hctRF[",
    database: "starkina_recovery",
  });
  // const connection = mysql.createConnection({
  //   host: "85.187.128.49" , 
  //   // host: "192.168.107.67",
  //   user: "starkina_recovery",
  //   password: "t7Oug+e7r)NZ",
  //   database: "starkina_recovery",
  // });

  // Connect to the MySQL server
  connection.connect(function (err, result) {
    if (err) throw err;
    console.log(result);
  });

  let columns = Object.keys(data[0])
    .map((key) => `${key} VARCHAR(255)`)
    .join(", ");
  let sqlc = `CREATE TABLE my_csv_table (${columns});`;
  connection.query(sqlc, function (err, result) {
    if (err) throw err;
    console.log(result);
  });

  // Insert the data into the MySQL table
  for (let row of data) {
    let keys = Object.keys(row)
      .map((key) => `\`${key}\``)
      .join(", ");
    let values = Object.values(row)
      .map((value) => `'${value}'`)
      .join(", ");
    let sql = `INSERT INTO my_csv_table (${keys}) VALUES (${values});`;
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  }

  // Close the connection to the MySQL server
  connection.end();
}

// module.exports = {convertXlsxToCsvM};

convertXlsxToCsvM(
  "C:\\Users\\safva\\OneDrive\\Desktop\\starkin_projects\\excel_convert\\large.xlsx"
);
