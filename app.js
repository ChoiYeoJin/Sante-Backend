require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// require("dotenv").config({ path: ".env.local" });

const port = process.env.PORT;
const uri = process.env.MONGO_CONNECTION;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//test

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB 연결 성공");
  })
  .catch((err) => {
    console.log("MongoDB 연결 실패 : ", err);
  });

module.exports = app;
