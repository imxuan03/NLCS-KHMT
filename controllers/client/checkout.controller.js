const Cart = require("../../models/cart.model");
const Flight = require("../../models/flight.model");
const Order = require("../../models/order.model");

const generateHelper = require("../../helpers/generate");

// [GET] /checkout
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;

        const cart = await Cart.findOne({
            _id: cartId
        })

        if (cart.flights.length > 0) {
            for (const item of cart.flights) {
                const flightId = item.flight_id;

                const flightInfor = await Flight.findOne({
                    _id: flightId
                });

                //thêm một key vào object item
                item.flightInfor = flightInfor;

                item.totalPrice = item.quantity * item.flightInfor.price
            }
        }

        //tính tổng tiền cả giỏ hàng
        cart.totalPrice = cart.flights.reduce((sum, item) => sum + item.totalPrice, 0);

        res.render('client/pages/checkout/index', {
            pageTitle: "Đặt hàng",
            cartDetail: cart
        })
    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect("back");
    }

}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId
        })

        for (const flight of order.flights) {
            const flightInfor = await Flight.findOne({
                _id: flight.flight_id
            });

            //thêm key vào mỗi flight trong flights
            flight.flightInfor = flightInfor;
            flight.totalPrice = flight.quantity * flight.price;
        }

        order.totalPrice = order.flights.reduce((sum, item) => sum + item.totalPrice, 0);

        res.render('client/pages/checkout/success', {
            pageTitle: "Đặt hàng thành công",
            order: order
        })
    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect("back");
    }

}

// [GET] /checkout/order
module.exports.order = async (req, res) => {
    try {
        //lưu các thông tin theo model order
        const cartId = req.cookies.cartId;
        const userInfor = req.body;

        const cart = await Cart.findOne({
            _id: cartId
        })

        let flights = [];

        for (const flight of cart.flights) {
            const objectFlight = {
                flight_id: flight.flight_id,
                price: 0,
                quantity: flight.quantity
            }

            const flightInfor = await Flight.findOne({
                _id: flight.flight_id
            })

            objectFlight.price = flightInfor.price;

            flights.push(objectFlight)

        }

        const objectOrder = {
            // user_id: String,
            cart_id: cartId,
            userInfor: userInfor,
            flights: flights
        }

        objectOrder.id_order = generateHelper.generateIdOrder(6);

        const order = new Order(objectOrder);
        await order.save();

        //xóa bên giỏ hàng để thành rỗng
        await Cart.updateOne({
            _id: cartId
        },
            {
                flights: []
            }
        );

        res.redirect(`/checkout/success/${order.id}`);

    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect("back");
    }

}
