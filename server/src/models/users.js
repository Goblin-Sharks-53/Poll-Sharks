//this is needed to read the .env file
require("dotenv").config();

const mongoose = require("mongoose");
//let password = Qw0PGEwC2Ip6wAHk
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const pollSchema = new mongoose.Schema({
  pollName: { type: String },
  pollTopics: [{ pollTopic: { type: String }, votes: { type: Number } }],
  code: { type: String },
  createdBy: { type: String },
});

const User = mongoose.model("User", userSchema);
const Poll = mongoose.model("Poll", pollSchema);

module.exports = { User, Poll };

// import express from "express";
// import mongoose from "mongoose";
// import path from "path";
// import User from "../models/User";

// const app = express();
// const port = 3000;

// mongoose.connect("mongodb link", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(express.static("client"));

// app.get("/home", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/home.html"));
// });

// app.post("./register", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const existUser = await User.findOne({ email });
//     if (existUser) {
//       return res.send("this email already registered");
//     }

//     const newUser = new User({
//       email,
//       password,
//     });

//     await newUser.save();

//     res.redirect("/login");
//   } catch (err) {
//     console.log(err);
//     res.send("error");
//   }
// });

// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/login.html"));
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.send("user not found");
//     }

//     if (password === user.password) {
//       res.redirect("/home");
//     } else {
//       res.send("incorrect password.");
//     }
//   } catch (err) {
//     console.log(err);
//     res.send("error");
//   }
// });

// app.get("/home", (req, res) => {
//   res.send("Home Page");
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
