const jwt = require('jsonwebtoken');
const util = require('util');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = util.promisify(jwt.verify);

const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        const decoded = await verifyJWT(token, JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        return next(new Error('Authentication error: Invalid Token'));
    }
};

module.exports = { authenticateSocket };
