const router = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

router.post("/kakao", async (req, res) => {
    try {
        const token = req.body;
        const ACCESS_TOKEN = token.accessToken;

        // 유저 정보 가져오기
        const userInfo = await axios.get("https://kapi.kakao.com/v2/user/me",
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );

        const userData = userInfo.data.kakao_account;
        const user = {
            email: userData.email,
            age: userData.age_range,
            gender: userData.gender,
        }

        // 일치하는 유저가 있는지 찾기
        const findUser = await User.findOne(user);

        if (!findUser) {
            // 일치하는 유저가 없으면 새로운 유저 생성 및 db에 저장
            const newUser = new User(user);
            await newUser.save();

            // jwt 생성
            const jwToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            // 클라이언트로 전송
            res.json({ jwToken });
        }

    } catch (error) {
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

module.exports = router;