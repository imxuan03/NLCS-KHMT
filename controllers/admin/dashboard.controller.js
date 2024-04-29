const Flight = require("../../models/flight.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");


// [GET] /admin/dashboard 
module.exports.index = async (req, res) => {
    //số lượng đặt vé theo loại ghế
    // Fetch Data
    let quantityTypeTicketFLightOrdered = {
        "first": 0,
        "eco": 0,
        "business": 0,
        "vip": 0,
    };
    
    
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

            if(flight.typeTicket === "firstPrice"){
                quantityTypeTicketFLightOrdered.first+=flight.quantity;
            }else if(flight.typeTicket === "ecoPrice"){
                quantityTypeTicketFLightOrdered.eco+=flight.quantity;
            }else if(flight.typeTicket === "businessPrice"){
                quantityTypeTicketFLightOrdered.business+=flight.quantity;
            }else if(flight.typeTicket === "vipPrice"){
                quantityTypeTicketFLightOrdered.vip+=flight.quantity;
            }
        });
    });

    //Số lượng hội viên
    const numberOfUser = await User.countDocuments({
        deleted: false,
        status: "active",
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
        pageTitle: "Trang Chủ",
        numberOfFlight: numberOfFlight,
        numberOfUser: numberOfUser,
        quantityTicketFLightOrdered: quantityTicketFLightOrdered,
        chartData: chartData, // Pass chart data to Pug
    })
}
