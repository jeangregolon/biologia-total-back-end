const mongoose = require("../database/index");

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    releaseDate: {
      type: Date,
    },
    expirationDate: {
      type: Date,
    },
    //Future implementation: list of professors
    // professors: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Professor",
    //     required: true,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
