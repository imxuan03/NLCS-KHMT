const systemConfig = require("../../config/system")

const dashboardRoutes = require("./dashboard.route")
const flightRoutes = require("./flight.route")
const accountRoutes = require("./account.route")

module.exports = (app)=>{

    const PATH_ADMIN =  "/" + systemConfig.prefixAdmin ;   //"/admin"

    app.use(PATH_ADMIN+"/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN+"/flights", flightRoutes);
    app.use(PATH_ADMIN+"/accounts", accountRoutes);
    
}