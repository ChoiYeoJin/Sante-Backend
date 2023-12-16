const router = require('express').Router();
const { User, Exercise, Food } = require("../models/users");

router.post("/check", async (req, res) => {
  try {
    const userData = req.body; 
    console.log("데이터 요청 받음:", userData);

    const user = await User.findOne(userData); 
    console.log("사용자 찾음:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = {
      user: user,
    };
    console.log("데이터:", result);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const user = req.body;

    console.log("user", user);

    const updatedUser = await User.findOneAndUpdate(
      {
        email: user.email,
      },
      user,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ message: "사용자 정보가 업데이트되었습니다.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "서버 오류: 사용자 정보를 업데이트할 수 없습니다.",
    });
  }
});


// 개별 유저 삭제
router.delete("/:email", async (req, res) => {
const email = req.params.email;

User.deleteOne({ email : email })
    .exec()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
});

module.exports = router;
