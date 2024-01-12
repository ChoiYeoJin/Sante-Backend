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
        const userBirthyear = userInfo.data.kakao_account.birthyear;
        console.log(userBirthyear);

        // 일치하는 유저가 있는지 찾기
        const findUser = await User.findOne({ email: userData.email });

        if (!findUser) {
            // 일치하는 유저가 없으면 새로운 유저 생성 및 db에 저장
            const newUser = new User({
                email: userData.email,
                password: userData.email,
                age: userData.birthyear,
                gender: userData.gender,
            });
            console.log(newUser);

            await newUser.save();
            console.log(newUser);

            // jwt 생성
            const jwToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            console.log(jwToken);

            // 클라이언트로 전송
            res.json({ jwToken });

            res.status(201).json(newUser);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

module.exports = router;