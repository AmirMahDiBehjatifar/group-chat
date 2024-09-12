const { hashSync } = require("bcrypt");
const { UserModel } = require("./user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userController = {
    renderHomePage: (req, res) => {
        res.render("index.ejs", { title: 'homepage' });
    },

    renderLoginPage: (req, res) => {
        res.render("login", { title: 'login' });
    },

    renderRegisterPage: (req, res) => {
        res.render("register", { title: 'register' });
    },

    renderProfilePage: (req, res) => {
        const user = req.user;
        res.render("profile", { title: 'profile', user });
    },

    logout: (req, res) => {
        req.logOut({ keepSessionInfo: false }, (err) => {
            if (err) console.log(err);
        });
        res.clearCookie('token');
        res.redirect("/login");
    },

    register: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const hashPassword = hashSync(password, 10);
            const user = await UserModel.findOne({ username });
            if (user) {
                req.flash("error", "این کاربری قبلا ثبت نام شده است نام دیگری را امتحان کنید");
                return res.redirect("/register");
            }
            await UserModel.create({ username, password: hashPassword });
            res.redirect("/login");
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    login: (req, res, next, err, user) => {
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
    }
};

module.exports = userController;
