const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {   
        // user_id: String,
        cart_id: String,
        id_order: String,
        userInfor: {
            fullName: String,
            phone: String,
            address: String,
        },
        flights: [
            {
                flight_id: String,
                price: Number,
                quantity: Number
            }
        ]
    }, 
    { timestamps: true }
); 

const Order = mongoose.model('Order', orderSchema, "orders");

module.exports = Order;