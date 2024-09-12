const { Router } = require("express");
const router = Router();
const { redirectIfIsAuth, checkAuthentication } = require("../../common/middlewares/checkAuth");
const { checkJWT } = require("../../common/middlewares/checkJwt");
const userController = require("./userController");

function initRoute(passport) {
    router.get("/", userController.renderHomePage);

    router.get("/login", redirectIfIsAuth, userController.renderLoginPage);

    router.get("/register", redirectIfIsAuth, userController.renderRegisterPage);

    router.get("/profile", checkAuthentication, checkJWT, userController.renderProfilePage);

    router.get("/logout", checkAuthentication, userController.logout);

    router.post("/register", redirectIfIsAuth, userController.register);

    router.post("/login", redirectIfIsAuth, (req, res, next) => {
        passport.authenticate('local', { session: true }, (err, user, info) => {
            userController.login(req, res, next, err, user);
        })(req, res, next);
    });

    return router;
}

module.exports = initRoute;
