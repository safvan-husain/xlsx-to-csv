const mysql = require("mysql");

class MyRemoteSql {
  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new MyRemoteSql();
    }
    return this.instance;
  }

  tableName = "vehicle_details";

  databaseName = "starkina_recovery";

  vehicleNo = "vehicleNumber";
  chassNo = "chassiNo";
  details = "details";
  agencyId = "agencyId";
  fileName = "fileName";

  connection = mysql.createConnection({
    host: "85.187.128.49",
    // host: "192.168.107.67",
    user: "starkina_recovery", 
    password: "t7Oug+e7r)NZ",
    // password: "H[FlB$hctRF[",
    database: this.databaseName,
  });

  async connect() { 
    // return new Promise((res, rej) => {
    //   this.connection.connect(
    //     function (err, result) {
    //       if (err) {
    //         rej(err);
    //       } else {
    //         res(result);
    //       }
    //     }.bind(this)
    //   );
    // });
  }

  async createTable(agencyId) { 
    // return new Promise((res, rej) => {
    //   this.connection.query(
    //     `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${this.databaseName}' AND table_name = '${this.tableName+agencyId}'`,
    //     async function (err, results) {
    //       if (err) rej(err);
    //       if (results[0]["COUNT(*)"] > 0) {
    //         console.log("table exist");
    //         // await this.logAllDataFromTable();
    //         res();
    //       } else {
    //         this.connection.query(
    //           `CREATE TABLE ${this.tableName+agencyId} (
    //           id INT AUTO_INCREMENT PRIMARY KEY,
    //           ${this.vehicleNo} VARCHAR(255),
    //           ${this.chassNo} VARCHAR(255),
    //           ${this.details} JSON,
    //           ${this.fileName} VARCHAR(255),
    //           ${this.agencyId} VARCHAR(255)
    //       )`,
    //           function (err, results) {
    //             if (err) rej(err);
    //             res(results);
    //           }
    //         );
    //         res();
    //       }
    //     }.bind(this)
    //   );
    // });
  }

  async logAllDataFromTable(agencyId) { 
    // await this.createTable(agencyId);
    // return new Promise((resolve, reject) => {
    //   this.connection.query(
    //     `SELECT * FROM ${this.tableName+agencyId}`,
    //     (err, results) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(results);
    //         console.log(results);
    //       }
    //     }
    //   );
    // });
  }

  async getDataByVehicleNumber(vehicleNo, agencyId) { 
    // await this.createTable(agencyId);
    // return new Promise((resolve, reject) => {
    //   this.connection.query(
    //     `SELECT ${this.details} FROM ${this.tableName+agencyId} WHERE ${this.vehicleNo} = ? AND ${this.agencyId} = ?`,
    //     [vehicleNo, agencyId],
    //     (err, results) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(results);
    //       }
    //     }
    //   );
    // });
  }

  async getDataByChassiNumber(chassNo, agencyId) {
    // await this.createTable(agencyId);
    // return new Promise((resolve, reject) => {
    //   this.connection.query(
    //     `SELECT * FROM ${this.tableName+agencyId} WHERE ${this.chassNo} = ? AND ${this.agencyId} = ?`,
    //     [chassNo, agencyId],
    //     (err, results) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(results);
    //       }
    //     }
    //   );
    // }); 
  }

  //ensue table exist.
  async initialize() {
    // return new Promise(async (res, rej) => {
    //   try {
    //     await this.connect();
    //   } catch (error) {
    //     rej(error);
    //   }
    // });
  }

  async addRecords(rows, titles, agencyId, fileName) {
    // console.log(`add records called ${rows.length}`); 
    // await this.createTable(agencyId);
    // let sql = `INSERT INTO ${this.tableName+agencyId} (${this.vehicleNo}, ${this.chassNo}, ${this.details}, ${this.fileName},${this.agencyId}) VALUES ?`;
    // // let values = jsonList.map(json => [json['ve'], json['ch'], JSON.stringify(json), agencyId]);
    // let values = rows.map((row) => {
    //   var json = {};

    //   for (let index = 0; index < titles.length; index++) {
    //     const title = titles[index];
    //     const item = row[index];
    //     json[title] = item;
    //   }

    //   var content = fileName.split("______");
    //   json["file name"] = content[0];
    //   json["finance"] = content[1];
    //   json["branch"] = content[2];

    //   var vehicleNumber = json["VEHICAL NO"]?? json["VEHICAL NO".toLowerCase()]?? json["VEHICLENO"]?? json["VEHICLENO".toLowerCase()]?? json["VEHICLE NO"]?? json["VEHICLE NO".toLowerCase()];

    //   return [
    //     //taking the last 4 char of the vehicle number.
    //     typeof vehicleNumber === "string" ? vehicleNumber.slice(-4) : undefined,
    //     json["CHASSIS NO"],
    //     JSON.stringify(json),
    //     fileName,
    //     agencyId,
    //   ];
    // }); 

    // return new Promise((resolve, reject) => {
    //   if (values.length > 0) {
    //     this.connection.query(sql, [values], function (err, result) {
    //       if (err) {
    //         console.log(err);
    //         reject(err);
    //       } else {
    //         console.log(result);
    //         resolve(result);
    //       }
    //     });
    //   } else {
    //     resolve();
    //   }
    // });
  }

  async deleteMatchingRecordsWithVehicleNo(vehicleNo, agencyId) {
    // await this.createTable(agencyId);
    // const sql = `DELETE FROM ${this.tableName+agencyId} WHERE ${this.vehicleNo} = ? AND ${this.agencyId} = ?`;
    // return new Promise((resolve, reject) => {
    //   this.connection.query(sql, [vehicleNo, agencyId], (error, results) => {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       resolve(results);
    //     }
    //   });
    // });
  }

  async deleteMatchingRecordsWithChassiNo(chassNo, agencyId) {
    // await this.createTable(agencyId);
    // const sql = `DELETE FROM ${this.tableName+agencyId} WHERE ${this.chassNo} = ? AND ${this.agencyId} = ?`;
    // return new Promise((resolve, reject) => {
    //   this.connection.query(sql, [chassNo, agencyId], (error, results) => {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       resolve(results);
    //     }
    //   });
    // });
   }

  async deleteAllOfaSingleAgencyFile(agencyId, fileName) {
    // await this.createTable(agencyId);
    // const sql = `DELETE FROM ${this.tableName+agencyId} WHERE ${this.fileName} = ?`;
    // return new Promise((resolve, reject) => {
    //   this.connection.query(sql, [fileName], (error, results) => {
    //     if (error) {
    //       console.log(error); 
    //       reject(error);
    //     } else {
    //       resolve(results);
    //     }
    //   });
    // });
   }

  async deleteAllRecords() { 
    // await this.createTable(agencyId);
    // const sql = `DELETE FROM ${this.tableName+agencyId}`;
    // return new Promise((resolve, reject) => {
    //   this.connection.query(sql, (error, results) => {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       resolve(results);
    //     }
    //   });
    // });
  }
}

module.exports = MyRemoteSql;
