const { default: mongoose } = require("mongoose");

const DB_URI = "mongodb://localhost:27017/gc-users";

mongoose.set('strictQuery', true);

async function ConnectToDB() {
    try {
        await mongoose.connect(DB_URI);
        console.log("connected to mongodb.");
    } catch (error) {
        console.log("failed to connect..");
    }
}
ConnectToDB();