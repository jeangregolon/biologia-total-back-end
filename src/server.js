require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./controllers/studentController")(app);
require("./controllers/courseController")(app);

app.get("/", (req, res) => {
  res.status(200).send("Server is ready");
});

module.exports = app;
