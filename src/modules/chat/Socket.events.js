const { saveMessage } = require('./messsage.service');

const socketEvents = (io) => {
    io.on('connection', (socket) => {
        const username = socket.user ? socket.user.username : 'Guest';

        socket.emit('message', `${username} Welcome to Chat App!`);
        socket.broadcast.emit('message', `User ${username} connected`);

        socket.on('message', async (data) => {
            io.emit('message', `${username}: ${data}`);
            await saveMessage(username, data);
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit('message', `User ${username} disconnected`);
        });

        socket.on('activity', (name) => {
            socket.broadcast.emit('activity', name);
        });
    });
};

module.exports = { socketEvents };
