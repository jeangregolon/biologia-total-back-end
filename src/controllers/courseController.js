const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");
const Student = require("../models/studentModel");

const router = express.Router();

// Returns all courser sorted by name or filters course by title
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      let query = {};

      if (req.query.titulo) {
        query = { title: { $regex: req.query.titulo } };
      }

      const courses = await Course.find(query).sort({
        title: 1,
      });
      if (courses.length > 0) {
        res.status(200).send(courses);
      } else {
        res.status(404).send({ message: "Nenhum curso encontrado." });
      }
    } catch (error) {
      res.status(400).send({ message: "Erro ao buscar cursos." });
    }
  })
);

//Returns a course by id
router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (course) {
        res.status(200).send(course);
      } else {
        res.status(404).send({ message: "Curso não encontrado." });
      }
    } catch (error) {
      res.status(400).send({ message: "Erro ao buscar curso." });
    }
  })
);

// Registers a new course
router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { code } = req.body;
    try {
      if (await Course.findOne({ code })) {
        res.status(400).send({ message: "Curso já cadastrado." });
      }

      const course = new Course({
        code: req.body.code,
        title: req.body.title,
        description: req.body.description,
        regularPrice: req.body.regularPrice,
        salePrice: req.body.salePrice,
        releaseDate: req.body.releaseDate,
        expirationDate: req.body.expirationDate,
      });

      const createdCourse = await course.save();

      res.status(201).send({
        _id: createdCourse._id,
        code: createdCourse.code,
        title: createdCourse.title,
        description: createdCourse.description,
        regularPrice: createdCourse.regularPrice,
        salePrice: createdCourse.salePrice,
        releaseDate: createdCourse.releaseDate,
        expirationDate: createdCourse.expirationDate,
        message: "Curso cadastrado com sucesso!",
      });
    } catch (error) {
      res.status(400).send({ message: "Não foi possível cadastrar o curso." });
    }
  })
);

//Updates a course by id
router.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (course) {
        course.code = req.body.code;
        course.title = req.body.title;
        course.description = req.body.description;
        course.regularPrice = req.body.regularPrice;
        course.salePrice = req.body.salePrice;
        course.releaseDate = req.body.releaseDate;
        course.expirationDate = req.body.expirationDate;

        const updatedCourse = await course.save();

        res
          .status(200)
          .send({ message: "Curso atualizado.", course: updatedCourse });
      } else {
        res.status(404).send({ message: "Curso não encontrado." });
      }
    } catch (error) {
      res.status(400).send({ message: "Não foi possível atualizar o curso." });
    }
  })
);

//Enrolls a student in a course
router.get(
  "/enroll/:courseId/:studentId",
  expressAsyncHandler(async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      const student = await Student.findById(req.params.studentId);

      if (!course) {
        res.status(404).send({ message: "Curso não encontrado." });
      }
      if (!student) {
        res.status(404).send({ message: "Aluno não encontrado." });
      }
      //Verify if student is already enrolled
      course.students.push(req.params.studentId);
      const updatedCourse = await course.save();
      res
        .status(200)
        .send({ updatedCourse, message: "Aluno matriculado com sucesso!" });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send({ message: "Não foi possível efetuar a matrícula." });
    }
  })
);

//Returns a list of students enrolled to a course
router.get(
  "/students/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate(
        "students",
        "name"
      );
      if (!course) {
        res.status(404).send({ message: "Curso não encontrado." });
      }
      res.status(200).send(course.students);
    } catch (error) {
      res.status(400).send({ message: "Erro ao buscar curso." });
    }
  })
);

module.exports = (app) => app.use("/courses", router);
