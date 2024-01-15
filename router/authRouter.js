const router = require("express").Router();
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
        const { email, password, age, gender } = req.body;
        const birthyear = Number(age);
        const birthYearNumber = calculateAge(birthyear);

        // 일치하는 유저가 있는지 찾기
        const findUser = await User.findOne({ email: email });

        if (!findUser) {
            // 일치하는 유저가 없으면 새로운 유저 생성 및 db에 저장
            const newUser = new User({
                email: email,
                password: password,
                age: birthYearNumber,
                gender: gender,
            });

            await newUser.save();

            // 새로운 유저 데이터 생성
            const token = createUserToken(newUser);
            return res.status(200).json({
                code: 200,
                message: "토큰이 생성되었습니다.",
                token: token,
                email: newUser.email,
                gender: newUser.gender,
                age: newUser.age,
            });
        } else {
            // 기존 유저 데이터 생성
            const token = createUserToken(findUser);
            return res.status(200).json({
                code: 200,
                message: "토큰이 생성되었습니다.",
                token: token,
                email: findUser.email,
                gender: findUser.gender,
                age: findUser.age,
            });
        }
    } catch (error) {
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

module.exports = router;