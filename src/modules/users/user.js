const { Router } = require("express");
const router = Router();
const { hashSync } = require("bcrypt");
const { UserModel } = require("./user.model");
const jwt = require("jsonwebtoken");
const { redirectIfIsAuth, checkAuthentication } = require("../../common/middlewares/checkAuth");
const { checkJWT } = require("../../common/middlewares/checkJwt");

const JWT_SECRET = 's3cr3t_k3y_f0r_jwt@2024!';

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

    router.get("/profile", checkAuthentication, checkJWT, (req, res) => {
        const user = req.user;
        res.render("profile", { title: 'profile', user });
    });

    router.get("/logout", checkAuthentication, (req, res) => {
        req.logOut({ keepSessionInfo: false }, (err) => {
            if (err) console.log(err);
        });
        res.clearCookie('token');

        res.redirect("/login");
    });


    router.post("/register", redirectIfIsAuth, async (req, res, next) => {
        try {
            const {username, password } = req.body;
            const hashPassword = hashSync(password, 10);
            const user = await UserModel.findOne({ username });
            if (user) {
                req.flash("error", "این کاربری قبلا ثبت نام شده است نام دیگری را امتحان کنید");
                return res.redirect("/register");
            }
            await UserModel.create({
                username,
                password: hashPassword
            });
            res.redirect("/login");
        } catch (error) {
            console.log(error);
            next(error);
        }
    });


    router.post("/login", redirectIfIsAuth, (req, res, next) => {
        passport.authenticate('local', { session: true }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
    
            req.login(user, { session: true }, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Login failed', error: err });
                }
    
                // create jwt token
                const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
                
                
    
                // saving token into cookie
                res.cookie('token', token, {
                    httpOnly: false,
                    secure: false,
                    maxAge: 3600000  // 1 Hour
                });
    
                return res.redirect('/profile');
            });
        })(req, res, next);
    });
    


    return router;
}

module.exports = initRoute;
