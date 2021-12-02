const mysql = require("mysql");

const { app, dataBase } = require("./app");

const dB = mysql.createConnection(dataBase);

dB.connect((err) => {
  if (err) throw err;
  console.log(`Database ${process.env.DATABASE} connected!`);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("uncaughtException", (err) => {
  if ((process.env.NODE_ENV = "development")) {
    console.log("Fatal Exception");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("unhandledRejection", (err) => {
  console.log("Something went wrong");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
