const systemConfig = require("../../config/system")

const authMiddleware = require("../../middlewares/admin/auth.middleware");
const authAdminMiddleware = require("../../middlewares/admin/authAdmin.middleware");


const dashboardRoutes = require("./dashboard.route")
const flightRoutes = require("./flight.route")
const accountRoutes = require("./account.route")
const authRoutes = require("./auth.route")
const myAccountRoutes = require("./my-account.route");

module.exports = (app)=>{

    const PATH_ADMIN =  "/" + systemConfig.prefixAdmin ;   //"/admin"

    app.use(
        PATH_ADMIN+"/dashboard", 
        authMiddleware.requireAuth, //middleware kiểm tra tài khoản để có thể truy cập vào
        dashboardRoutes
    );
    app.use(
        PATH_ADMIN+"/flights",
        authMiddleware.requireAuth, 
        flightRoutes
    );
    app.use(PATH_ADMIN+"/accounts",
        authMiddleware.requireAuth,
        authAdminMiddleware.requireAuthAdmin,
        accountRoutes
    );
    app.use(PATH_ADMIN+"/auth", authRoutes);

    app.use(
        PATH_ADMIN+"/my-account",
        authMiddleware.requireAuth, 
        myAccountRoutes
    );

    
    
}