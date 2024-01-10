const router = require("express").Router();

router.post("/kakao", async (req, res) => {
    try {
        const { token } = req.body;
        console.log(token);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

module.exports = router;