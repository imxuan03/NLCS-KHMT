const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const user = await Account.findOne({
        token: req.cookies.token
    })

    if(!user){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    res.locals.user = user;  //đưa user ra local

    next();
}