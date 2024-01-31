const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/app_storage.db");

const VehicleReport = "VehicleReport";
//22682
db.serialize(() => { 
  db.run(
    `CREATE TABLE ${VehicleReport} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicleDetails TEXT,
        reportTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        reporterId INTEGER,
        isConfirmed BOOLEAN DEFAULT FALSE,
        authorizedBy TEXT,
        agencyId INTEGER
    )`,
    (result, err) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );
});

function insertIntoVehicle(vehicleDetails, reporterId, agencyId) {
  let sql = `INSERT INTO ${VehicleReport} (vehicleDetails, reportTime, reporterId, isConfirmed, authorizedBy) VALUES (?, ?, ?, ?, ?)`;
  let params = [vehicleDetails, null, reporterId, false, "", agencyId];
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      }
      console.log(`Row inserted with rowid ${this.lastID}`);
      resolve(this.lastID);
    });
  });
}

function getConfirmedReports() {
  let sql = `SELECT * FROM ${VehicleReport} WHERE isConfirmed = TRUE`;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getNotConfirmedReports() {
  let sql = `SELECT * FROM ${VehicleReport} WHERE isConfirmed = FALSE`;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function updateData(tableName, columnValues, condition) {
  let sql = `UPDATE ${tableName} SET ${columnValues} WHERE ${condition}`;
  return new Promise((resolve, reject) => {
    db.run(sql, [], function (err) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      console.log(`Rows updated: ${this.changes}`);
      resolve(this);
    });
  });
}

async function confirmReport(reportId, verifier) {
  await updateData(
    VehicleReport,
    `isConfirmed = TRUE, authorizedBy = ${verifier}`,
    `id = ${reportId}`
  );
}

module.exports = { confirmReport, insertIntoVehicle, getConfirmedReports, getNotConfirmedReports}
