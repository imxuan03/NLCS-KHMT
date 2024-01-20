const Flight = require("../../models/flight.model");

module.exports.index = async (req, res) => {
    const flights = await Flight.find({});

    console.log(flights)

    res.render("admin/pages/flights/index",{
        pageTitle: "Dịch Vụ Chuyến Bay",
        flights:flights
    });
}