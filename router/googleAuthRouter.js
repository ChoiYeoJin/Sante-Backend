require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const router = require("express").Router();
const axios = require("axios");
const { User } = require("../models/users");
const createUserToken = require("../utils/jwtUtil");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_PWD,
  process.env.GOOGLE_REDIRECT_URL
);

const calculateAge = (birthYear) => {
  // 현재 년도 가져오기
  const currentYear = new Date().getFullYear();
  // 나이 계산
  const age = currentYear - birthYear;

  let ageNumber;

  switch (true) {
    case age >= 12 && age <= 14:
      ageNumber = 1;
      break;
    case age >= 15 && age <= 18:
      ageNumber = 2;
      break;
    case age >= 19 && age <= 29:
      ageNumber = 3;
      break;
    case age >= 30 && age <= 49:
      ageNumber = 4;
      break;
    case age >= 50 && age <= 64:
      ageNumber = 5;
      break;
    default:
      ageNumber = 6;
      break;
  }
  return ageNumber;
};

router.post("/login", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade"); //NOTE: for using http

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", //NOTE force refresh token to be created
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/user.birthday.read",
      "https://www.googleapis.com/auth/user.gender.read",
    ],
  });

  res.json({ url: authorizeUrl });
});

async function getUserData(access_token) {
  try {
    const [basicProfileResponse, detailedProfileResponse] = await Promise.all([
      axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      axios.get(
        `https://people.googleapis.com/v1/people/me?personFields=birthdays,genders,emailAddresses`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      ),
    ]);

    const email = detailedProfileResponse.data.emailAddresses?.[0]?.value;
    // console.log("email:", email);

    const gender = detailedProfileResponse.data.genders?.[0]?.value;
    // console.log("Gender:", gender);

    const birthdateData = detailedProfileResponse.data.birthdays?.find(
      (birthday) => birthday.metadata.primary
    );

    let birthdayYear = "";
    if (birthdateData) {
      const { year } = birthdateData.date;
      console.log(`Birthday: ${year}`);
      birthdayYear = String(year);
    } else {
      console.log("Primary birthday is not available.");
    }

    const age = calculateAge(birthdayYear);

    return {
      basicProfile: basicProfileResponse.data,
      detailedProfile: {
        email,
        password: email,
        age,
        gender,
      },
    };
  } catch (error) {
    console.error("Error fetching user data", error);
    throw error;
  }
}

router.post("/login/token", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade"); //NOTE: for using http

  const code = req.body.code;
  console.log("my code", code);

  try {
    const response = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(response.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    const userDetails = await getUserData(user.access_token);
    const genderInfo = userDetails.detailedProfile.gender;
    const whatGender = (genderInfo) => {
      if (genderInfo === "women") {
        return "여자";
      } else {
        return "남자";
      }
    };
    const gender = whatGender(genderInfo);
    const age = userDetails.detailedProfile.age;
    const email = userDetails.basicProfile.email;
    const password = userDetails.basicProfile.password;

    const existingUser = await User.findOne({ email: email });
    console.log("-----existingUser------", existingUser);

    if (!existingUser) {
      console.log("email", email);
      console.log("password", password);
      console.log("gender", gender);
      console.log("age", age);
      const newUser = new User({
        email,
        password,
        gender,
        age,
      });
      await newUser.save();
    }
    const jwToken = createUserToken(email);
    return res.json({ jwToken });
  } catch (err) {
    console.error("Error with signing in with Google", err);
  }
});

module.exports = router;
