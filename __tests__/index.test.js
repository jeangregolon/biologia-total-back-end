const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server");

beforeAll((done) => {
  done();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Test if server is up", () => {
  it("should get main route", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

describe("Test student's routes", () => {
  it("should create a student", async () => {
    const random = Math.floor(Math.random() * (999999 - 1) + 1).toString();
    const res = await request(app).post("/students/register").send({
      name: random,
      email: random,
      password: random,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to create an existing student", async () => {
    await request(app).post("/students/register").send({
      name: "name",
      email: "email",
      password: "password",
    });
    const res = await request(app).post("/students/register").send({
      name: "name",
      email: "email",
      password: "password",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to create an empty student", async () => {
    const res = await request(app).post("/students/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should return all students", async () => {
    const res = await request(app).get("/students");
    expect(res.statusCode).toBe(200);
  });

  it("should return one student by query", async () => {
    const res = await request(app).get("/students?nome=name");
    expect(res.statusCode).toBe(200);
  });

  it("should not return a student by query", async () => {
    const res = await request(app).get("/students?nome=qwertyuiop");
    expect(res.statusCode).toBe(404);
  });

  it("should return a student by id", async () => {
    const search = await request(app).get("/students?nome=name");
    const res = await request(app).get(`/students/${search.body[0]._id}`);
    expect(res.statusCode).toBe(200);
  });

  it("should not return a student by id", async () => {
    const res = await request(app).get(`/students/zzzzzzzzzzzzzzzzzzzzzzzz`);
    expect(res.statusCode).toBe(400);
  });

  it("should update a student by id", async () => {
    const search = await request(app).get("/students?nome=name");
    const res = await request(app).put(`/students/${search.body[0]._id}`).send({
      name: "name",
      email: "email",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
  });

  it("should not update a student with empty body", async () => {
    const search = await request(app).get("/students?nome=name");
    const res = await request(app)
      .put(`/students/${search.body[0]._id}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
