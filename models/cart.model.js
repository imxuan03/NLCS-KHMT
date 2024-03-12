const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        flights: [
            {
                flight_id: String,
                quantity: Number,
                typeTicket: String,
                price:Number,
            }
        ],
    }, 
    { timestamps: true }
); 

const Cart = mongoose.model('Cart', cartSchema, "carts");

module.exports = Cart;