const { authenticateSocket } = require('./auth');
const { socketEvents } = require('./Socket.events');

module.exports = (io) => {
    io.use(authenticateSocket);
    socketEvents(io);
};
