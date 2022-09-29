import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongodb from "mongodb";
import { MongoClient } from "mongodb";
const URL = process.env.DB;
const app = express();

let mentor = [];
let student = [];
// MidleWare
app.use(express.json());
app.use(cors());

const createConnection = async () => {
  const client = new MongoClient(URL);
  await client.connect();
  console.log("MongoDB connected");
  return client;
};
const client = await createConnection();

// getting mentor data
app.get("/mentors", async (req, res) => {
  try {
    let mentor = await client.db("Zen").collection("mentor").find().toArray();
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// getting student data
app.get("/students", async (req, res) => {
  try {
    let student = await client.db("Zen").collection("student").find().toArray();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// create mentor
app.post("/mentor", async (req, res) => {
  try {
    let response = await client
      .db("Zen")
      .collection("mentor")
      .insertOne(req.body);
    res.status(200).json({ message: "Data inserted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
  // req.body.id = mentor.length + 1;
  // mentor.push(req.body);
  // res.json({ message: "Mentor Created Successfully" });
});

// create student
app.post("/student", async (req, res) => {
  try {
    let response = await client
      .db("Zen")
      .collection("student")
      .insertOne(req.body);
    res.status(200).json({ message: "Data inserted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
  // req.body.id = student.length + 1;
  // student.push(req.body);
  // res.json({ message: "student Created Successfully" });
});

// adding mentor to students
app.post("/addMentor", async (req, res) => {
  try {
    let response = client.db("Zen").collection("student");
    let student = req.body.studentName;
    let Mentor = req.body.MentorName;
    for (let i = 0; i < student.length; i++) {
      let men = await response.updateOne(
        { Name: student[i] },
        { $set: { Mentor: Mentor } }
      );
    }
    res.status(200).json({ message: "Data inserted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Editing mentor to students
app.put("/EditingMentor", async (req, res) => {
  try {
    let response = client.db("Zen").collection("student");
    let student = req.body.studentName;
    let Mentor = req.body.MentorName;
    let men = await response.findOneAndUpdate(
      { Name: student },
      { $set: { Mentor: Mentor } }
    );
    res.status(200).json({ message: "Data inserted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log("listen on port 8000");
});
