const Flight = require("../../models/flight.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");

const moment = require('moment');


// [GET] /admin/dashboard 
module.exports.index = async (req, res) => {

    //Số lượng chuyến bay
    const numberOfFlight = await Flight.countDocuments({
        deleted: false,
        status: "active",
    });

    //Số lượng vé được đặt
    let quantityTicketFLightOrdered = 0;
    const orders = await Order.find({});
    orders.forEach(order => {
        order.flights.forEach(flight => {
            quantityTicketFLightOrdered += flight.quantity;
        });
    });

    //Số lượng hội viên
    const numberOfUser = await User.countDocuments({
        deleted: false,
        status: "active",
    });

    //======================================================================================

    //số lượng đặt vé theo loại ghế
    // Fetch Data
    let quantityTypeTicketFLightOrdered = {
        "first": 0,
        "eco": 0,
        "business": 0,
        "vip": 0,
    };

    let totalPriceTypeTicketFlightOrdered = {
        "first": 0,
        "eco": 0,
        "business": 0,
        "vip": 0,
    }
    
    //thống kê trên 6 tháng
    const monthNumber = req.query.statistictime;
    let statisticTImeLimit;

    if(monthNumber==3){
        // Tính ngày 3 tháng trước từ ngày hiện tại
        statisticTImeLimit = moment().subtract(3, 'months').toDate();
    }else if(monthNumber==6){
        // Tính ngày 6 tháng trước từ ngày hiện tại
        statisticTImeLimit = moment().subtract(6, 'months').toDate();
    }else if(monthNumber==12){
        // Tính ngày 1 năm trước từ ngày hiện tại
        statisticTImeLimit = moment().subtract(1, 'years').toDate();
    }
    const orders6 = await Order.find({ createdAt: { $gte: statisticTImeLimit } });

    orders6.forEach(order => {
        order.flights.forEach(flight => {

            if(flight.typeTicket === "firstPrice"){
                quantityTypeTicketFLightOrdered.first+=flight.quantity;
                totalPriceTypeTicketFlightOrdered.first+=flight.quantity*flight.price;
            }else if(flight.typeTicket === "ecoPrice"){
                quantityTypeTicketFLightOrdered.eco+=flight.quantity;
                totalPriceTypeTicketFlightOrdered.eco+=flight.quantity*flight.price;
            }else if(flight.typeTicket === "businessPrice"){
                quantityTypeTicketFLightOrdered.business+=flight.quantity;
                totalPriceTypeTicketFlightOrdered.business+=flight.quantity*flight.price;
            }else if(flight.typeTicket === "vipPrice"){
                quantityTypeTicketFLightOrdered.vip+=flight.quantity;
                totalPriceTypeTicketFlightOrdered.vip+=flight.quantity*flight.price;
            }

        });
    });

    // **Chart Configuration**
    const chartData = {
        labels: ["Thương gia", "Phổ thông", "Kinh doanh", "VIP"],
        datasets: [{
            label: "Số lượng đặt vé theo loại ghế",
            data: [quantityTypeTicketFLightOrdered.first, quantityTypeTicketFLightOrdered.eco, 
                quantityTypeTicketFLightOrdered.business, quantityTypeTicketFLightOrdered.vip],
            backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)'],
            borderWidth: 1,
        }]
    };


    res.render('admin/pages/dashboard/index', {
        pageTitle: "Vietjet Air | Website chính thức",
        numberOfFlight: numberOfFlight,
        numberOfUser: numberOfUser,
        quantityTicketFLightOrdered: quantityTicketFLightOrdered,
        totalPriceTypeTicketFlightOrdered:totalPriceTypeTicketFlightOrdered,
        chartData: chartData, // Pass chart data to Pug
    })
}
