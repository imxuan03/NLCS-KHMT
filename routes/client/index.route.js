const homeRoutes = require("./home.route");
const serviceRoutes = require("./service");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");

//middleware
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {

    app.use(cartMiddleware.cartId);

    app.use('/', homeRoutes)

    app.use('/cart', cartRoutes);  
    
    app.use('/service', serviceRoutes);

    app.use('/checkout', checkoutRoutes);

    
}