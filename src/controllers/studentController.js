const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const Student = require("../models/studentModel");

const router = express.Router();

// Returns all students sorted by name or filters students by name
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      let query = {};

      if (req.query.nome) {
        query = { name: { $regex: req.query.nome } };
      }

      const students = await Student.find(query).sort({
        name: 1,
      });
      if (students.length > 0) {
        res.status(200).send(students);
      } else {
        res.status(404).send({ message: "Nenhum aluno encontrado." });
      }
    } catch (error) {
      res.status(400).send({ message: "Erro ao buscar alunos." });
    }
  })
);

//Returns a student by id
router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (student) {
        res.status(200).send(student);
      } else {
        res.status(404).send({ message: "Aluno não encontrado." });
      }
    } catch (error) {
      res.status(400).send({ message: "Erro ao buscar aluno." });
    }
  })
);

// Registers a new student
router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      if (await Student.findOne({ email })) {
        res.status(400).send({ message: "E-mail já cadastrado." });
      }

      const user = new Student({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
      });

      const createdUser = await user.save();

      res.status(201).send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        message: "Cadastro realizado com sucesso!",
      });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Não foi possível realizar o cadastro." });
    }
  })
);

//Updates a student by id
router.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (student) {
        student.name = req.body.name;
        student.email = req.body.email;
        student.password = req.body.password;

        const updatedStudent = await student.save();

        res
          .status(200)
          .send({ message: "Cadastro atualizado.", student: updatedStudent });
      } else {
        res.status(404).send({ message: "Aluno não encontrado." });
      }
    } catch (error) {
      res
        .status(400)
        .send({ message: "Não foi possível atualizar o cadastro." });
    }
  })
);

//Returns a list of courses the student is enrolled
router.get(
  "/courses/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).populate(
        "courses",
        "title"
      );
      if (!student) {
        res.status(404).send({ message: "Aluno não encontrado." });
      }
      res.status(200).send(student.courses);
    } catch (error) {
      res.status(400).send({ message: "Erro ao buscar aluno." });
    }
  })
);

module.exports = (app) => app.use("/students", router);
