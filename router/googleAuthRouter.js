require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const router = require("express").Router();
const axios = require("axios");

const redirectUrl = "http://kdt-sw-7-team04.elicecoding.com/api/googleOauth";

//NOTE: 리디렉션 url 생성
router.post("/", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade"); //NOTE: for using http

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", //NOTE force refresh token to be created
    //액세스 토큰은 짧은 유효 시간을 가지고 있어, 만료되면 사용자가 다시 로그인해야 한다.
    //하지만 offline 접근 유형을 설정하면, 애플리케이션은 리프레시 토큰을 받게 되고,
    //사용자가 매번 로그인하지 않아도, 애플리케이션이 사용자의 데이터에 지속적으로 접근할 수 있게 된다.
    scope: "https://www.googleapis.com/auth/userinfo.profile openid",
    prompt: "consent", //NOTE sign-in한 상태여도 체크
  });

  res.json({ url: authorizeUrl });
});

//
async function getUserData(access_token) {
  //   const response = await fetch(
  //     `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  //   );
  //   const data = await response.json();
  //   console.log("data", data);
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        params: { access_token: access_token },
      }
    );
    console.log("data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data", error);
    throw error;
  }
}

router.get("/", async function (req, res, next) {
  const code = req.query.code;
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const response = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(response.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    console.log("credentials", user);
    await getUserData(user.access_token);
  } catch (err) {
    console.error("Error with signing in with Google", err);
  }
});

module.exports = router;
