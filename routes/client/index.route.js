const homeRoutes = require("./home.route");
const myflightRoutes = require("./myflight");
const serviceRoutes = require("./service");
const cartRoutes = require("./cart.route");

//middleware
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {

    app.use(cartMiddleware.cartId);

    app.use('/', homeRoutes)

    app.use('/myflight',myflightRoutes );
      
    app.use('/service', serviceRoutes);

    app.use('/cart', cartRoutes);
}