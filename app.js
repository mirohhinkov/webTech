const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const url = require("url");

const dbControler = require("./Controllers/dbController");
const catchAsync = require("./Controllers/catchAsync");

const globalErrorHandler = require("./Controllers/errorController");

dotenv.config({ path: "./config.env" });

const dataBase = {
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const app = express();

// Helpers

const showEvents = (req, res) => {
  const { year, years, data } = req;
  res.status(200).render("years", { year, years, data });
};

// Setting the template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "10kb" }));

// Adding dataBase to the request object
app.use((req, res, next) => {
  req.dataBase = dataBase;
  next();
});

//get festival years from dB
app.use(
  catchAsync(async (req, res, next) => {
    req.sql =
      "SELECT DISTINCT DATE_FORMAT(Startdate, '%Y') AS Year FROM Events ORDER BY Year;";
    const result = await dbControler.request(req, res, next);
    const years = result.map((el) => el[Object.keys(el)[0]]);
    console.log(years);
    req.years = years;
    next();
  })
);

// ROUTES
app.get("/faq", (req, res) => {
  res.status(200).send("FAQ");
});

app.get("/contact", (req, res) => {
  let year = url.parse(req.url, true).query.year;
  res.status(200).render("contact", { year, years: req.years });
});

app.post(
  "/api/v1/contact",
  catchAsync(async (req, res, next) => {
    const { name, email, message } = req.body;
    req.sql = `INSERT INTO user_queries (user_name, user_email, query_text)
             VALUES (?, ?, ?);`;
    req.sqlArgs = [name, email, message];
    await dbControler.request(req, res, next);
    res.status(200).send("Done");
  })
);

app.use(
  catchAsync(async (req, res, next) => {
    const now = new Date();
    const year = req.url.split("/").pop() || now.getFullYear();
    if (isNaN(year)) next();
    req.sql = `SELECT e.Name, e.Startdate, p.PerformerName, s.Name 
            FROM Events e 
            INNER JOIN Performer p
            USING(PerformerID)
            INNER JOIN Stage s
            USING (StageID)
            WHERE DATE_FORMAT(e.Startdate, '%Y') = ?`;
    req.sqlArgs = [year];
    const result = await dbControler.request(req, res, next);
    req.year = year;
    req.data = result;
    next();
  })
);

app.get("/year/:year", showEvents);

app.get("/", showEvents);

app.all("*", (req, res) => {
  res.status(404).send("Route non implemented");
});

app.use(globalErrorHandler);

module.exports = { app, dataBase };
