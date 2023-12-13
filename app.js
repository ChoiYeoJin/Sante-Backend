require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./router/userRouter");

const port = process.env.PORT;
const uri = process.env.MONGO_CONNECTION;

const app = express();

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB 연결 성공");
  })
  .catch((err) => {
    console.log("MongoDB 연결 실패 : ", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 라우터 세팅
app.use("/user", userRouter);

app.listen(3000, () => {
  console.log("3000번 포트에서 서버가 실행되었습니다!");
});

module.exports = app;
