const mongoose = require('mongoose');

const flightRouteSchema = new mongoose.Schema(
    {
        departureCity:String,
        arrivalCity: [
            {
                type: String,
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    }, 
    { timestamps: true }
); 

const FlightRoute = mongoose.model('FlightRoute', flightRouteSchema, "flight-routes");

module.exports = FlightRoute;