const router = require("express").Router();
const { User, Exercise, Food } = require("../models/users");

// R(GET) - 모든 정보 조회
router.get("/user-all", async (req, res) => {
  try {
    res.status(200).json({ message: "Request successful(Main)" });
  } catch {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const userEmail = req.params.email; // 아이디
    console.log("Received request for email:", userEmail);

    // 사용자 이메일 주소를 기반으로 데이터를 조회해서 user로 저장
    const user = await User.findOne({email: userEmail}); // 걍 이메일
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 사용자의 운동 데이터 조회
    const exerciseList = await Exercise.find({
      _id: { $in: user.userExerciseList },
    });

    // 사용자의 음식 데이터 조회
    const foodList = await Food.find({ _id: { $in: user.userFoodList } });

    // 결과를 모아가지고 result로 응답
    const result = {
      user: user,
      exerciseList: exerciseList,
      foodList: foodList,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
