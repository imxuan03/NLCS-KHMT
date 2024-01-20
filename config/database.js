const mongoose = require('mongoose');

module.exports.connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected!")
    } catch (error) {
        console.log("Connect Error!")
    }
}