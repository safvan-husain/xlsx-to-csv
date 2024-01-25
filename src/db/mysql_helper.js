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

  vehicleNo = 'vehicleNumber';
  chassNo = 'chassiNo';
  details = 'details'
  agencyId = 'agencyId';
  fileName = 'fileName';

  connection = mysql.createConnection({
    host: "85.187.128.49",
    // host: "192.168.107.67",
    user: "starkina_recovery",
    password: "t7Oug+e7r)NZ",
    // password: "H[FlB$hctRF[",
    database: this.databaseName,
  });

  async connect() {
    return new Promise((res, rej) => {
      this.connection.connect(function (err, result) {
        if (err) {
          rej(err);
        } else {
          // var sql = "DROP TABLE vehicle_details";
          // this.connection.query(sql, function (err, result) {
          //    if (err) throw err;
          //    console.log("Table deleted");
          // });
          res(result);
        }
      }.bind(this));
    });
  }

  async createTable() {
    return new Promise((res, rej) => {
      this.connection.query(
        `CREATE TABLE ${this.tableName} (
        ${this.vehicleNo} VARCHAR(255),
        ${this.chassNo} VARCHAR(255),
        ${this.details} JSON,
        ${this.fileName} VARCHAR(255),
        ${this.agencyId} VARCHAR(255)
    )`,
        function (err, results) {
          if (err) rej(err);
          res(results);
        }
      );
    });
  }

  async logAllDataFromTable() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM ${this.tableName}`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results); 
          }
        }
      );
    });
  }

  async getDataByVehicleNumber(vehicleNo, agencyId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT ${this.details} FROM ${this.tableName} WHERE ${this.vehicleNo} = ? AND ${this.agencyId} = ?`, 
        [vehicleNo, agencyId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  async getDataByChassiNumber(chassNo, agencyId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM ${this.tableName} WHERE ${this.chassNo} = ? AND ${this.agencyId} = ?`,
        [chassNo, agencyId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  //ensue table exist.
  async initialize() {
    return new Promise(async (res, rej) => {
      try {
        await this.connect();

        this.connection.query(
          `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${this.databaseName}' AND table_name = '${this.tableName}'`,
          async function (err, results) {
            if (err) rej(err);
            if (results[0]["COUNT(*)"] > 0) {
              console.log("table exist");
              // await this.logAllDataFromTable();
              res();
            } else {
              await this.createTable();
              res();
            }
          }.bind(this)
        );
      } catch (error) {
        rej(error);
      }
    });
  }

  async addRecords(rows, titles, agencyId, fileName) {
    let sql = `INSERT INTO ${this.tableName} (${this.vehicleNo}, ${this.chassNo}, ${this.details}, ${this.agencyId}) VALUES ?`;
    // let values = jsonList.map(json => [json['ve'], json['ch'], JSON.stringify(json), agencyId]);
    let values = rows.map((row) => {
      var json = {};

      for (let index = 0; index < titles.length; index++) {
        const title = titles[index];
        const item = row[index];
        json[title] = item;
      }

      return [
        //taking the last 4 char of the vehicle number.
        json["VEHICAL NO"].slice(-4),
        json["CHASSIS NO"],
        JSON.stringify(json),
        fileName,
        agencyId,
      ];
    });   
 
    values = values.filter((v) => {
      if(v[0] === undefined && v[1] === undefined) {
        return false;
      }
      return true;
    });  


    return new Promise((resolve, reject) => {
      if(values.length > 0) {
        this.connection.query(sql, [values], function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } else {
        resolve();
      }
      
    }); 
  }

  async deleteMatchingRecordsWithVehicleNo(vehicleNo, agencyId) {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.vehicleNo} = ? AND ${this.agencyId} = ?`;
    return new Promise((resolve, reject) => {
      this.connection.query(sql, [vehicleNo, agencyId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  } 

  async deleteMatchingRecordsWithChassiNo(chassNo, agencyId) {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.chassNo} = ? AND ${this.agencyId} = ?`;
    return new Promise((resolve, reject) => {
      this.connection.query(sql, [chassNo, agencyId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  } 

  async deleteAllOfaSingleAgency(agencyId) {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.agencyId} = ?`;
    return new Promise((resolve, reject) => {
      this.connection.query(sql, [agencyId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  async  deleteAllRecords() {
    const sql = `DELETE FROM ${this.tableName}`;
    return new Promise((resolve, reject) => {
       this.connection.query(sql, (error, results) => {
         if (error) {
           reject(error);
         } else {
           resolve(results);
         }
       });
    });
   }
} 

module.exports = MyRemoteSql;
