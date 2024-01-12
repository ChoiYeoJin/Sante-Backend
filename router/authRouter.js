const router = require("express").Router();
const axios = require("axios");
const createUserToken = require("../utils/jwtUtil");
const { User } = require("../models/users");

const calculateAge = (birthYear) => {
    // 현재 년도 가져오기
    const currentYear = new Date().getFullYear();
    // 나이 계산
    const age = currentYear - birthYear;

    let ageNumber;

    switch (true) {
        case (age >= 12 && age <= 14):
            ageNumber = 1;
            break;
        case (age >= 15 && age <= 18):
            ageNumber = 2;
            break;
        case (age >= 19 && age <= 29):
            ageNumber = 3;
            break;
        case (age >= 30 && age <= 49):
            ageNumber = 4;
            break;
        case (age >= 50 && age <= 64):
            ageNumber = 5;
            break;
        default:
            ageNumber = 6;
            break;
    }
    return ageNumber;
};

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
        const birthyear = Number(userInfo.data.kakao_account.birthyear);
        const birthYearNumber = calculateAge(birthyear);
        const userEmail = userData.email;

        // 일치하는 유저가 있는지 찾기
        const findUser = await User.findOne({ email: userData.email });

        if (!findUser) {
            // 일치하는 유저가 없으면 새로운 유저 생성 및 db에 저장
            const newUser = new User({
                email: userData.email,
                password: userData.email,
                age: birthYearNumber,
                gender: userData.gender,
            });

            await newUser.save();
            console.log(newUser);

            // jwt 생성
            const jwToken = createUserToken(userEmail);
            return res.json({ jwToken });
        } else {
            // jwt 생성
            const jwToken = createUserToken(userEmail);
            return res.json({ jwToken });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

module.exports = router;