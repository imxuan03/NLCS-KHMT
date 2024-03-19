const Order = require("../../models/order.model");
const Flight = require("../../models/flight.model");


const systemConfig = require("../../config/system");
// [GET] /admin/orders 
module.exports.index = async  (req, res) => {

    const records = await Order.find({})


    let totalPrice = 0;
    for (const record of records) {
        let totalPrice = 0;
        for (const flight of record.flights) {
            const flightInfo = await Flight.findOne({ _id: flight.flight_id });
            if (flightInfo && flightInfo.title) {
                flight.flightName = flightInfo.title;
            }
            totalPrice += flight.quantity*flight.price;
        }
        record.totalPrice=totalPrice;
    }

    res.render('admin/pages/orders/index', {
        pageTitle: "Quản lý đơn vé",
        records: records,
    })
}