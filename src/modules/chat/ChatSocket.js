const jwt = require('jsonwebtoken');
const util = require('util');
const JWT_SECRET = 's3cr3t_k3y_f0r_jwt@2024!';

const verifyJWT = util.promisify(jwt.verify);

module.exports = (io) => {
    io.use(async (socket, next) => {
        try {
            
            const token = socket.handshake.query.token;
            // console.log("Received JWT Token:", token);

            if (!token) {
                console.error('No token provided');
                return next(new Error('Authentication error: No token provided'));
            }

            // verify token
            const decoded = await verifyJWT(token, JWT_SECRET);

            socket.user = decoded; // saving userdata in socket
            next();  
        } catch (err) {
            console.error('JWT Authentication error:', err);
            return next(new Error('Authentication error: Invalid Token'));
        }
    });

    io.on('connection', (socket) => {

        // return username
        const username = socket.user ? socket.user.username : 'Guest';
        // Upon connection - only to user 
        socket.emit('message', `${username} Welcome to Chat App!`)

        // Upon connection - to all others 
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}} connected`)

        // Listening for a message event 
        socket.on('message', data => {
            console.log(data)
            io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
        })

        // When user disconnects - to all others 
        socket.on('disconnect', () => {
            socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}} disconnected`)
        })

        // Listen for activity 
        socket.on('activity', (name) => {
            socket.broadcast.emit('activity', name)
        })
    });
};
