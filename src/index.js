const express = require("express");
const studentController = require("./controllers/studentController");

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./controllers/studentController")(app);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
