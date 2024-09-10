const { Router } = require("express");
const router = Router();
const { hashSync } = require("bcrypt");
const { UserModel } = require("../model/userModel");
const { redirectIfIsAuth, checkAuthentication } = require("../middleware");


function initRoute(passport) {
    router.get("/", (req, res) => {
        res.render("index.ejs", { title: 'homepage' })
    });

    router.get("/login", redirectIfIsAuth, (req, res) => {
        res.render("login", { title: 'login' })
    });

    router.get("/register", redirectIfIsAuth, (req, res) => {
        res.render("register", { title: 'register' })
    });
    router.get("/profile", checkAuthentication, (req, res) => {
        const user = req.user
        res.render("profile", { title: 'register', user });
    });
    router.get("/logout", checkAuthentication, (req, res) => {
        req.logOut({ keepSessionInfo: false }, (err) => {
            if (err) console.log(err);
        });
        res.redirect("/login")
    })

    router.post("/register", redirectIfIsAuth, async (req, res, next) => {
        try {
            const { fullname: fullName, username, password } = req.body;
            const hashPassword = hashSync(password, 10);
            const user = await UserModel.findOne({ username })
            if (user) {
                const referrer = req?.header('Referrer') ?? req.headers.referer;
                req.flash("error", "این کاربری قبلا ثبت نام شده است نام دیگری را امتحان کنید");
                return res.redirect(referrer ?? "/register")
            }
            await UserModel.create({
                fullName,
                username,
                password: hashPassword
            });
            res.redirect("/login");
        } catch (error) {
            console.log(error);
            next(error)
        }
    })
    router.post("/login", redirectIfIsAuth, passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true
    }), async (req, res) => {
        res.redirect("/profile")
    })
    return router;
}

module.exports = initRoute
