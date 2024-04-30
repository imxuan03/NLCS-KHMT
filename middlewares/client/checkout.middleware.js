const Cart = require("../../models/cart.model");

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