const Cart = require("../../models/cart.model");

// [POST] /cart/add/:flightId
module.exports.addPost = async  (req, res) => {
    const cartId = req.cookies.cartId;
    const flightId = req.params.flightId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
        _id: cartId
    });

    const existFlightInCart = cart.flights.find(item => item.flight_id == flightId);


    if(existFlightInCart){
        const newQuantity = quantity + existFlightInCart.quantity;

        await Cart.updateOne(
            {
                _id: cartId,
                'flights.flight_id': flightId
            },
            {
                'flights.$.quantity' : newQuantity
            }
        );

    }else{
        const objectCart = {
            flight_id: flightId,
            quantity: quantity,
        };

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: {flights: objectCart }
            }
        );
        req.flash('success', 'Đặt vé thành công!');
    }

    res.redirect("back");
}

