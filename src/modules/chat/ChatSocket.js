const jwt = require('jsonwebtoken');
const util = require('util');
const { MessageModel } = require('./chat.model');
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
        socket.broadcast.emit('message', `User ${username} connected`)

        // Listening for a message event 
        socket.on('message', async (data) => {
            console.log(data);
            io.emit('message', `${username}: ${data}`);
              
            async function saveMsg() {
                try {
                    await MessageModel.create({ username, message: data }); 
                } catch (error) {
                    console.error('Error saving message:', error); 
                }
            }
        
           
            saveMsg();
        });

        // When user disconnects - to all others 
        socket.on('disconnect', () => {
            socket.broadcast.emit('message', `User ${username} disconnected`)
        })

        // Listen for activity 
        socket.on('activity', (name) => {
            socket.broadcast.emit('activity', name)
        })
    });
};
