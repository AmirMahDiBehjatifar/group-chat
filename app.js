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
const { Server } = require("socket.io");
require("./src/config/mongoose.config");

const app = express();
const PORT = 3000;

// Create HTTP server
const httpServer = http.createServer(app);

// SocketIo Server
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["localhost:3000","http://127.0.0.1:3000"]
    }
});

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`)

    socket.on("message", (data) => {
        // Echo the message back to the client 
        console.log(data);
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
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
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Socket.io server is also running on localhost:${PORT}`);
});
