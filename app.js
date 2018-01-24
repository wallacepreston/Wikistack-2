const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const indexView = require("./views/index");

app.use(morgan("dev")); //logging middleware
app.use(express.static(path.join(__dirname, "./public"))); //serving up static files (e.g. css files)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/wiki", require("./routes/wiki"));
app.use("/users", require("./routes/users"));

app.get('/', function (req, res) {
   res.redirect('/wiki/');
});

//error handling middleware - MUST have all 4 parameters
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal Error");
});

module.exports = app;
