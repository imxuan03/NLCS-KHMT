const Cart = require("../../models/cart.model");
const Flight = require("../../models/flight.model");
const Order = require("../../models/order.model");
const systemConfig = require("../../config/system");

module.exports.cartId = async (req, res, next) => {

    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 24 * 365;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });
    } else {
        //khi đã có giỏ hàng
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })

        cart.totalQuantity = cart.flights.reduce((sum, item) => sum + item.quantity, 0);

        res.locals.miniCart = cart;
    }


    next();
}

//update lại số lượng của chuyến bay giỏ hàng 
module.exports.reload = async (req, res, next) => {

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

            //=======================================================
            //#######################################################
            // Ràng buộc quantity 
            let numberOfTypeSeats = {
                first: 0,
                eco: 0,
                business: 0,
                vip: 0
            }
            if (flightInfor.availableSeats == 200) {
                numberOfTypeSeats.first = 20;
                numberOfTypeSeats.eco = 150;
                numberOfTypeSeats.business = 20;
                numberOfTypeSeats.vip = 10;
            } else if (flightInfor.availableSeats == 244) {
                numberOfTypeSeats.first = 25;
                numberOfTypeSeats.eco = 182;
                numberOfTypeSeats.business = 25;
                numberOfTypeSeats.vip = 12;
            } else if (flightInfor.availableSeats == 180) {
                numberOfTypeSeats.first = 20;
                numberOfTypeSeats.eco = 130;
                numberOfTypeSeats.business = 20;
                numberOfTypeSeats.vip = 10;
            }
            //============================
            const orders = await Order.find({});

            let orderedQuantity = 0;

            orders.forEach(order => {
                order.flights.forEach(flight => {
                    if (flight.typeTicket == item.typeTicket && item.flight_id == flight.flight_id) {
                        orderedQuantity += flight.quantity;
                    }
                });

            });

            if (item.typeTicket == 'firstPrice') {
                if (orderedQuantity + item.quantity > numberOfTypeSeats.first) {
                    const availableSeatsOrder = numberOfTypeSeats.first - orderedQuantity;

                    await Cart.updateOne(
                        {
                            _id: cartId,
                            'flights.flight_id': item.flight_id,
                            'flights.typeTicket': item.typeTicket
                        },
                        {
                            'flights.$.quantity': availableSeatsOrder
                        }
                    );
                }
            } else if (item.typeTicket == 'ecoPrice') {
                if (orderedQuantity + item.quantity > numberOfTypeSeats.eco) {
                    const availableSeatsOrder = numberOfTypeSeats.eco - orderedQuantity;

                    await Cart.updateOne(
                        {
                            _id: cartId,
                            'flights.flight_id': item.flight_id,
                            'flights.typeTicket': item.typeTicket
                        },
                        {
                            'flights.$.quantity': availableSeatsOrder
                        }
                    );
                }
            } else if (item.typeTicket == 'businessPrice') {
                if (orderedQuantity + item.quantity > numberOfTypeSeats.business) {
                    const availableSeatsOrder = numberOfTypeSeats.business - orderedQuantity;

                    await Cart.updateOne(
                        {
                            _id: cartId,
                            'flights.flight_id': item.flight_id,
                            'flights.typeTicket': item.typeTicket
                        },
                        {
                            'flights.$.quantity': availableSeatsOrder
                        }
                    );
                }
            } else if (item.typeTicket == 'vipPrice') {
                if (orderedQuantity + item.quantity > numberOfTypeSeats.vip) {
                    const availableSeatsOrder = numberOfTypeSeats.vip - orderedQuantity;

                    await Cart.updateOne(
                        {
                            _id: cartId,
                            'flights.flight_id': item.flight_id,
                            'flights.typeTicket': item.typeTicket
                        },
                        {
                            'flights.$.quantity': availableSeatsOrder
                        }
                    );
                }
            }
        }
    }
    next();
}