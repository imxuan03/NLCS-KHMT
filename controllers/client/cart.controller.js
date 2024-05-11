const Cart = require("../../models/cart.model");
const Flight = require("../../models/flight.model");
const Order = require("../../models/order.model");

// [GET] /cart
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

                //price các loại
                let price = 0;
                if (item.typeTicket == "firstPrice") {
                    price = item.flightInfor.price[0].price;
                } else if (item.typeTicket == "ecoPrice") {
                    price = item.flightInfor.price[1].price;
                } else if (item.typeTicket == "businessPrice") {
                    price = item.flightInfor.price[2].price;
                } else if (item.typeTicket == "vipPrice") {
                    price = item.flightInfor.price[3].price;
                }
                item.price = price;

                item.totalPrice = item.quantity * price;
            }
        }

        //tính tổng tiền cả giỏ hàng
        cart.totalPrice = cart.flights.reduce((sum, item) => sum + item.totalPrice, 0);
        res.render('client/pages/cart/index', {
            pageTitle: "Vietjet Air | Giỏ hàng",
            cartDetail: cart
        })
    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect("back");
    }

}

// [POST] /cart/add/:flightId
module.exports.addPost = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const flightId = req.params.flightId;
        const quantity = parseInt(req.body.quantity);
        const typeTicket = req.body.typeTicket;

        

        const cart = await Cart.findOne({
            _id: cartId,
        });

        //######################################################################
        // Số lượng các loại vé 
        // Boeing 737 MAX 200 của Vietjet Air : 200 (first: 20, eco: 150, business: 20, vip: 10)
        // Airbus A321 và Airbus A321 neo của Vietjet Air: 244
        // Airbus A320 và A320 neo của Vietjet Air: 180
        const flight1 = await Flight.findOne({
            _id: flightId,
        })
        let numberOfTypeSeats = {
            first: 0,
            eco: 0, 
            business: 0, 
            vip: 0
        } 
        if(flight1.availableSeats == 200){
            numberOfTypeSeats.first = 20;
            numberOfTypeSeats.eco = 150;
            numberOfTypeSeats.business = 20;
            numberOfTypeSeats.vip = 10;
        }else if(flight1.availableSeats == 244){
            numberOfTypeSeats.first = 25;
            numberOfTypeSeats.eco = 182;
            numberOfTypeSeats.business = 25;
            numberOfTypeSeats.vip = 12;
        }else if(flight1.availableSeats == 180){
            numberOfTypeSeats.first = 20;
            numberOfTypeSeats.eco = 130;
            numberOfTypeSeats.business = 20;
            numberOfTypeSeats.vip = 10;
        }
        
        // #####################################################################
        // ràng buộc số lượng vé khi add cart
        const orders = await Order.find({});

        let orderedQuantity = 0;

        orders.forEach(order => {
            order.flights.forEach(flight => {
                if(flight.typeTicket == typeTicket && flightId == flight.flight_id){
                    orderedQuantity+= flight.quantity;
                }
            });
    
        });

        
        // Số lượng trong card 
        let numberFlightInCard = 0 ;
        cart.flights.forEach(flight => {
            if(flight.typeTicket == typeTicket && flightId == flight.flight_id){
                numberFlightInCard+= flight.quantity;
            }
        });
        

        if(typeTicket == 'firstPrice'){
            if(orderedQuantity+quantity+numberFlightInCard>numberOfTypeSeats.first){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }else if(typeTicket == 'ecoPrice'){
            if(orderedQuantity+quantity+numberFlightInCard>numberOfTypeSeats.eco){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }else if(typeTicket == 'businessPrice'){
            if(orderedQuantity+quantity+numberFlightInCard>numberOfTypeSeats.business){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }else if(typeTicket == 'vipPrice'){
            if(orderedQuantity+quantity+numberFlightInCard>numberOfTypeSeats.vip){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }

        // #####################################################################





        // nếu mà chuyến bay đó đã tồn tại rồi thì nếu thêm vào sẽ thay đổi số lượng đặt

        //với cùng chuyến (khác loại vé) ==> cũng lưu riêng biệt 
        const existFlightInCart = cart.flights.find(item => item.flight_id == flightId && item.typeTicket == typeTicket);


        if (existFlightInCart) {
            const newQuantity = quantity + existFlightInCart.quantity;

            await Cart.updateOne(
                {
                    _id: cartId,
                    'flights.flight_id': flightId
                },
                {
                    'flights.$.quantity': newQuantity
                }
            );

        } else {

            const flight = await Flight.findOne({
                _id: flightId,
            })

            let price = 0;
            if (typeTicket == "firstPrice") {
                price = flight.price[0].price;
            } else if (typeTicket == "ecoPrice") {
                price = flight.price[1].price;
            } else if (typeTicket == "businessPrice") {
                price = flight.price[2].price;
            } else if (typeTicket == "vipPrice") {
                price = flight.price[3].price;
            }

            const objectCart = {
                flight_id: flightId,
                quantity: quantity,
                typeTicket: typeTicket,
                price: price,
            };


            await Cart.updateOne(
                {
                    _id: cartId
                },
                {
                    $push: { flights: objectCart }
                }
            );

        }
        req.flash('success', 'Thêm vé vào giỏ hàng thành công!');
        res.redirect(`/cart`);
    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect("back");
    }

}

// [GET] /cart/delete/:flightId
module.exports.delete = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const flightId = req.params.flightId;
        const typeTicket = req.params.typeTicket;

        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                //dùng để xóa 1 chuyến bay ra khỏi Cart
                "$pull": { flights: { "flight_id": flightId, "typeTicket": typeTicket } }
            },
        );


        req.flash('success', 'Xóa đặt vé thành công!');
        res.redirect("back");
    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect(`/${systemConfig.prefixAdmin}/flights`);
    }

}

// [GET] /cart/update/:flightId/:quantity
module.exports.update = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const flightId = req.params.flightId;
        const quantity = parseInt(req.params.quantity);
        const typeTicket = req.params.typeTicket;

                //######################################################################
        // Số lượng các loại vé 
        // Boeing 737 MAX 200 của Vietjet Air : 200 (first: 20, eco: 150, business: 20, vip: 10)
        // Airbus A321 và Airbus A321 neo của Vietjet Air: 244
        // Airbus A320 và A320 neo của Vietjet Air: 180
        const flight1 = await Flight.findOne({
            _id: flightId,
        })
        let numberOfTypeSeats = {
            first: 0,
            eco: 0, 
            business: 0, 
            vip: 0
        } 
        if(flight1.availableSeats == 200){
            numberOfTypeSeats.first = 20;
            numberOfTypeSeats.eco = 150;
            numberOfTypeSeats.business = 20;
            numberOfTypeSeats.vip = 10;
        }else if(flight1.availableSeats == 244){
            numberOfTypeSeats.first = 25;
            numberOfTypeSeats.eco = 182;
            numberOfTypeSeats.business = 25;
            numberOfTypeSeats.vip = 12;
        }else if(flight1.availableSeats == 180){
            numberOfTypeSeats.first = 20;
            numberOfTypeSeats.eco = 130;
            numberOfTypeSeats.business = 20;
            numberOfTypeSeats.vip = 10;
        }

        // ràng buộc số lượng vé khi add cart
        const orders = await Order.find({});

        let orderedQuantity = 0;

        orders.forEach(order => {
            order.flights.forEach(flight => {
                if(flight.typeTicket == typeTicket && flightId == flight.flight_id){
                    orderedQuantity+= flight.quantity;
                }
            });
    
        });
        
        if(typeTicket == 'firstPrice'){
            if(orderedQuantity+quantity>numberOfTypeSeats.first){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }else if(typeTicket == 'ecoPrice'){
            if(orderedQuantity+quantity>numberOfTypeSeats.eco){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }else if(typeTicket == 'businessPrice'){
            if(orderedQuantity+quantity>numberOfTypeSeats.business){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }else if(typeTicket == 'vipPrice'){
            if(orderedQuantity+quantity>numberOfTypeSeats.vip){
                req.flash('error', `Số lượng ghế không hợp lệ!.`);
                res.redirect("back");
                return;
            }
        }


        //=================================================================

        await Cart.updateOne(
            {
                _id: cartId,
                'flights.flight_id': flightId,
                'flights.typeTicket': typeTicket
            },
            {
                'flights.$.quantity': quantity
            }
        );

        req.flash('success', 'Cập nhật số lượng!');
        res.redirect("back");
    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect("back");
    }
    
}