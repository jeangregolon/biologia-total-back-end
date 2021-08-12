const express = require("express");

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./controllers/studentController")(app);
require("./controllers/courseController")(app);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
