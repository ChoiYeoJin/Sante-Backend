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
    const user = await User.findOne({ email: userEmail }); // 걍 이메일
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

// 모든 유저 삭제
router.delete("/delete-all", async (req, res) => {
  User.deleteMany({})
    .exec()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

// 개별 유저 삭제
router.delete("/delete/:email", async (req, res) => {
const email = req.params.email;
console.log(userId);
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

// 운동 삭제
router.delete("/delete/:exerciseId", async (req, res) => {
  const exerciseId = req.params.exerciseId;
  Exercise.deleteOne({ exerciseId: exerciseId })
      .exec()
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
});

// 식단 삭제
router.delete("/delete/:foodId", async (req, res) => {
  const foodId = req.params.foodId;
 
  Food.deleteOne({ foodId: foodId })
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
