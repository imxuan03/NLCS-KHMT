const Order = require("../../models/order.model");
const Flight = require("../../models/flight.model");
// [GET] /myflight
module.exports.index = async (req, res) => {

    res.render('client/pages/myflight/index', {
        pageTitle: "Trang Chủ",
    })
}

// [GET] /myflight/search
module.exports.search = async (req, res) => {
    try {
        const id_order = req.query.id_order;
        const fullName = req.query.fullName;
    
        const order = await Order.findOne({
            id_order: id_order,
            'userInfor.fullName' : fullName
        });
    
        if(!order){
            req.flash('error', `Mã đơn vé không tồn tại!`);
            res.redirect(`/myflight`);
            return;
        }
            
    
    
        for(const flight of order.flights){
            const flightInfor = await Flight.findOne({
                _id: flight.flight_id
            });
    
            //thêm key vào mỗi flight trong flights
            flight.flightInfor = flightInfor;
            flight.totalPrice = flight.quantity * flight.price;
        }
        order.totalPrice = order.flights.reduce((sum, item) => sum+item.totalPrice, 0);
           
        res.render('client/pages/myflight/search', {
            pageTitle: "Thông tin đặt vé",
            order:order,
        })      
    } catch (error) {
        req.flash('error', `Đã xảy ra lỗi dữ liệu.`);
        res.redirect("back");
    }

}
