const Cart = require("../../models/cart.model");
const Flight = require("../../models/flight.model");

// [GET] /cart
module.exports.index = async  (req, res) => {
    
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id:cartId
    })

    if(cart.flights.length>0){
        for(const item of cart.flights){
            const flightId = item.flight_id;

            const flightInfor = await Flight.findOne({
                _id : flightId
            });

            //thêm một key vào object item
            item.flightInfor = flightInfor;

            item.totalPrice = item.quantity * item.flightInfor.price
        }
    }
    
    //tính tổng tiền cả giỏ hàng
    cart.totalPrice = cart.flights.reduce((sum, item) => sum+item.totalPrice, 0);

    res.render('client/pages/cart/index', {
        pageTitle: "Chuyến bay của tôi",
        cartDetail: cart
    })
}



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

// [GET] /cart/delete/:flightId
module.exports.delete = async  (req, res) => {
    const cartId = req.cookies.cartId;
    const flightId = req.params.flightId;

    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            //dùng để xóa 1 chuyến bay ra khỏi Cart
            "$pull" : {flights: {"flight_id" : flightId}}
        },
    );


    req.flash('success', 'Xóa đặt vé thành công!');
    res.redirect("back");
}

// [GET] /cart/update/:flightId/:quantity
module.exports.update = async  (req, res) => {
    const cartId = req.cookies.cartId;
    const flightId = req.params.flightId;
    const quantity = req.params.quantity;

    await Cart.updateOne(
        {
            _id: cartId,
            'flights.flight_id': flightId
        },
        {
            'flights.$.quantity' : quantity
        }
    );

    req.flash('success', 'Cập nhật số lượng!');
    res.redirect("back");
}