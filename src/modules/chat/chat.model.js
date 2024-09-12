const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now } 
});

const MessageModel = mongoose.model('Messages', MessageSchema); 
module.exports = {
    MessageModel
};
