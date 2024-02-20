const homeRoutes = require("./home.route");
const serviceRoutes = require("./service");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

//middleware
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleWare = require("../../middlewares/client/user.middleware");

module.exports = (app) => {

    app.use(cartMiddleware.cartId);

    app.use(userMiddleWare.inforUser);

    app.use('/', homeRoutes)

    app.use('/cart', cartRoutes);  
    
    app.use('/service', serviceRoutes);

    app.use('/checkout', checkoutRoutes);

    app.use('/user', userRoutes);

    
}