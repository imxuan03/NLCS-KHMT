const Cart = require("../../models/cart.model");
const Flight = require("../../models/flight.model");

module.exports.checkoutPage = async (req, res, next) => {

    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })

    //Xóa những flight trong cart có số lượng =0
    for (const flight of cart.flights) {
        if (flight.quantity <= 0) {
            await Cart.updateOne(
                {
                    _id: cartId,
                },
                {
                    //dùng để xóa 1 chuyến bay ra khỏi Cart
                    "$pull": { flights: { "flight_id": flight.flight_id, "typeTicket": flight.typeTicket } }
                },
            );
        }
    }

    next();
}


module.exports.checkDayAddFlight = async (req, res, next) => {
    //lưu biến xem nó có cái nào phạm lỗi là Ngày hiện tại sau ngày khởi hành không.
    let flag = 0;
    let currentDate = new Date();

    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })

    for (const flight of cart.flights) {
        const flightDetail = await Flight.findById(flight.flight_id);
        const departureDate = new Date(flightDetail.departureDate);

        // Ngày hiện tại sau ngày khởi hành
        if (currentDate > departureDate) {
            flag = 1;
            console.log("Ngày hiện tại sau ngày khởi hành");
            // Xóa chuyến bay khỏi giỏ hàng
            cart.flights = cart.flights.filter(item => item.flight_id.toString() !== flightDetail._id.toString());
            await cart.save(); // Lưu lại giỏ hàng đã cập nhật
        }
    }

    if (flag == 1) {
        req.flash('error', `Không thể thực hiện đặt chuyến bay vì chuyến bay đã cất cánh!.`);
        res.redirect("back");
        return;
    }

    next();
}
