const flightRoutes = require("./flight.route");
const homeRoutes = require("./home.route");
module.exports = (app) => {

    app.use('/', homeRoutes)
      
    app.use('/flights', flightRoutes)
      
}