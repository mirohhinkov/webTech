const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const dbControler = require("./Controllers/dbController");
const catchAsync = require("./Controllers/catchAsync");

dotenv.config({ path: "./config.env" });

const dataBase = {
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const app = express();

// Setting the template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "10kb" }));

// Adding dataBase to the request object
app.use((req, res, next) => {
  console.log("Add db");
  req.dataBase = dataBase;
  next();
});

//get menu items from dB
app.use(async (req, res, next) => {
  req.sql =
    "SELECT DISTINCT DATE_FORMAT(Startdate, '%Y') AS Year FROM Events ORDER BY Year;";
  const result = await dbControler.request(req, res, next);
  const years = result.map((el) => el[Object.keys(el)[0]]);
  console.log(years);
  req.years = years;
  next();
});

app.get("/faq", (req, res) => {
  res.status(200).send("FAQ");
});

app.get("/contact/:year", (req, res) => {
  res
    .status(200)
    .render("contact", { year: req.params.year, years: req.years });
});

app.post("/api/v1/contact", async (req, res, next) => {
  const { name, email, message } = req.body;
  req.sql = `INSERT INTO user_queries (user_name, user_email, query_text)
             VALUES ('${name}', '${email}', '${message}');`;
  await dbControler.request(req, res, next);
  res.status(200).send("Done");
});

app.get("/year/:year", async (req, res, next) => {
  const year = req.params.year;
  req.sql = `SELECT e.Name, e.Startdate, p.PerformerName, s.Name 
            FROM Events e 
            INNER JOIN Performer p
            USING(PerformerID)
            INNER JOIN Stage s
            USING (StageID)
            WHERE DATE_FORMAT(e.Startdate, '%Y') = ${year}`;
  const result = await dbControler.request(req, res, next);
  console.log(result);

  res.status(200).render("years", { year, years: req.years, data: result });
});

app.get(
  "/",
  catchAsync(async (req, res, next) => {
    let now = new Date();

    res.status(200).render("default", {
      year: now.getFullYear(),
      years: req.years,
      data: [],
    });
  })
);

app.all("*", (req, res) => {
  res.status(404).send("Route non implemented");
});

module.exports = { app, dataBase };
