const router = require("express").Router();
const { User } = require("../models/users");

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

module.exports = router;
