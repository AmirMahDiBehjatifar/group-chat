const { Router } = require("express");
const { checkJWT } = require("../../common/middlewares/checkJwt");
const router = Router();


router.get("/chat",checkJWT,(req, res, next) => {
    res.render("chatpage.ejs", { title: 'Group-Chat' });
})

module.exports = router;