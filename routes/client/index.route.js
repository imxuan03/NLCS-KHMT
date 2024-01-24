const homeRoutes = require("./home.route");
const myflightRoutes = require("./myflight");
const serviceRoutes = require("./service");
module.exports = (app) => {

    app.use('/', homeRoutes)

    app.use('/myflight',myflightRoutes );
      
    app.use('/service', serviceRoutes);
}