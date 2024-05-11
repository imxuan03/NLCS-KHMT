const Flight = require("../../models/flight.model");
const systemConfig = require("../../config/system");

const moment = require('moment');

module.exports.checkStatusFlight = async (req, res, next) => {
    const flights = await Flight.find({});
    
    for (const flight of flights) {
        if (moment(flight.departureDate).isBefore(moment())) {
            await Flight.updateOne({ _id: flight._id }, { $set: { status: "inactive" } });
        }
    }

    next();
}