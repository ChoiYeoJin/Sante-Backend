const router = require("express").Router();
const { User } = require("../models/users");

router.post("", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, gender, age } = req.body;

    const newUser = new User({
      email,
      password,
      gender,
      age,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

module.exports = router;
