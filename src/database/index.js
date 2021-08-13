const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://127.0.0.1/biologia-total",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

module.exports = mongoose;
