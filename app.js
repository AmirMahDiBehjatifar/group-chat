// requirements
const express = require("express");
const http = require("http");
const AllExceptionHandler = require("./src/common/exception/errorsHandler");
const NotFoundErr = require("./src/common/exception/notFoundpage");
const expressLayouts = require("express-ejs-layouts");
const userRouter = require("./src/modules/users/user");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const { passportInit } = require("./src/modules/users/passport.config");
const passport = require("passport");
const ws = require("ws");
require("./src/config/mongoose.config");

const app = express();
const PORT = 3000;

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server
const SocketServer = new ws.Server({ server });

SocketServer.on("connection", (socket) => {
    console.log("New WebSocket connection established.");

    socket.on("message", (message) => {
        const b = Buffer.from(message);
        console.log(b.toString());
        // Echo the message back to the client
        socket.send(`${message}`);
    });

    socket.on("close", () => {
        console.log("WebSocket connection closed.");
    });
});

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Setup view-engine
app.use(expressLayouts);
app.set("view engine", "ejs");
// app.set("layout", "./layout/main.ejs");
app.set("layout", "./layout/chatpage.ejs");


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

// Error-Handling
app.use(NotFoundErr);
app.use(AllExceptionHandler);

// Start server on HTTP and WebSocket
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`WebSocket server is also running on ws://localhost:${PORT}`);
});
