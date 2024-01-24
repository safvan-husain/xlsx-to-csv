const {
  confirmReport,
  insertIntoVehicle,
  getConfirmedReports,
  getNotConfirmedReports,
} = require("./src/vehicle_report_storage.js");

insertIntoVehicle("this is the details", 1, 2)
  .then((v) => {
    console.log(value);
    getNotConfirmedReports()
      .then((v) => console.log(v))
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(e));
