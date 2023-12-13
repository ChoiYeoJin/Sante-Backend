require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./router/userRouter");
const registerRouter = require("./router/registerRouter");

const port = process.env.PORT;
const uri = process.env.MONGO_CONNECTION;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 라우터 세팅
app.use("/user", userRouter);
app.use("/register", registerRouter);

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB 연결 성공");
  })
  .catch((err) => {
    console.log("MongoDB 연결 실패 : ", err);
  });


app.listen(process.env.port, () => {
  console.log(`server on port ${process.env.port}`);
});

module.exports = app;
