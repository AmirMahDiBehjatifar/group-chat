// requirements
const express = require("express");
const AllExceptionHandler = require("./src/common/exception/errorsHandler");
const NotFoundErr = require("./src/common/exception/notFoundpage");
const expressLayouts = require("express-ejs-layouts");
const userRouter = require("./src/modules/users/user");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const { passportInit } = require("./src/modules/users/passport.config");
const passport = require("passport");
require("./src/config/mongoose.config");


const app = express();
const PORT = 3000;
 

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Setup view-engine
app.use(expressLayouts);
app.set("view engine", 'ejs');
app.set('layout', './layout/main.ejs');


// Set up Session 
app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
}))
// Setup Passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(userRouter(passport));

// Error-Handling
app.use(NotFoundErr);
app.use(AllExceptionHandler);

app.listen(PORT, () => {
    console.log(`Server is run on port ${PORT}`);
});