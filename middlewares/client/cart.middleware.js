const Cart = require("../../models/cart.model");
const systemConfig = require("../../config/system");

module.exports.cartId = async (req, res, next) => {

    if(!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();

        const expiresTime = 1000 * 60 * 60 * 24 * 365;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });
    }else{
        //khi đã có giỏ hàng
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })

        cart.totalQuantity = cart.flights.reduce((sum, item)=>sum + item.quantity, 0);

        res.locals.miniCart = cart;
    }


    next();
}


module.exports.reload = async (req, res, next) => {

    next();
}