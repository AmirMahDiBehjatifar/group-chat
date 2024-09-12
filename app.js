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
const { Server } = require("socket.io");
require("./src/config/mongoose.config");
const ChatSocket = require("./src/modules/chat/ChatSocket");
const cookieParser = require('cookie-parser');
const ChatRouter = require("./src/modules/chat/chat.routes");

const app = express();
const PORT = 3000;


// Create server on Express
const expressServer = app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
    console.log(`Socket.io server is also running on localhost:${PORT}`);

});
// SocketIo Server
const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["localhost:3000", "http://127.0.0.1:3000"]
    }
});

// Using ChatSocket
ChatSocket(io);



// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',  
    etag: false,   
    lastModified: false  
}));

// Setup view-engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layout/main.ejs");



// Set up Session 
app.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: false,
    })
);

// Setup Passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(userRouter(passport));
app.use(ChatRouter);

// Error-Handling
app.use(NotFoundErr);
app.use(AllExceptionHandler);

