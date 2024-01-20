const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
    {
        title: String, 
        description: String,
        price: Number,
        status: {
            type:String,
            default:"active",
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    }, 
    { timestamps: true }
); 

const Flight = mongoose.model('Flight', flightSchema, "flights");

module.exports = Flight;