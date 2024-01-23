const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const flightSchema = new mongoose.Schema(
    {
        title: String, 
        description: String,
        price: Number,
        departureCity: String,
        arrivalCity: String,
        departureDate: {
            type: String,
            // validate: {
            //     validator: function(v) {
            //         // Sử dụng regex để kiểm tra định dạng "yyyy-mm-dd"
            //         return /^\d{4}-\d{2}-\d{2}$/.test(v);
            //     },
            //     message: props => `${props.value} không phải là định dạng ngày hợp lệ ("yyyy-mm-dd")!`
            // }
        },
        arrivalDate: {
            type: String,
            // validate: {
            //     validator: function(v) {
            //         // Sử dụng regex để kiểm tra định dạng "yyyy-mm-dd"
            //         return /^\d{4}-\d{2}-\d{2}$/.test(v);
            //     },
            //     message: props => `${props.value} không phải là định dạng ngày hợp lệ ("yyyy-mm-dd")!`
            // }
        },
        departureTime: String,
        arrivalTime: String,
        availableSeats: Number,
        thumbnail: String,
        status: {
            type:String,
            default:"active",
        },
        position:Number,
        slug: {
            type: String, 
            slug: "title" ,
            unique: true
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