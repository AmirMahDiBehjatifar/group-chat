const { MessageModel } = require('./chat.model');

const saveMessage = async (username, message) => {
    try {
        await MessageModel.create({ username, message });
    } catch (error) {
        console.error('Error saving message:', error);
    }
};

module.exports = { saveMessage };
