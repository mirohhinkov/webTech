const mysql = require("mysql");
// const catchAsync = require('./catchAsynccatchAsync');

exports.request = (req, res) => {
  if (process.env.NODE_ENV == "development") console.log(`query - ${req.sql}`);
  return new Promise((resolve, reject) => {
    const dB = mysql.createConnection(req.dataBase);
    dB.connect((err) => {
      if (err) reject(err);
      if (process.env.NODE_ENV == "development") console.log("Connected!");
      dB.query(req.sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  });
};
