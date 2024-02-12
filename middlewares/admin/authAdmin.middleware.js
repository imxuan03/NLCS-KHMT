const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.requireAuthAdmin = async (req, res, next) => {
    const user = await Account.findOne({
        token: req.cookies.token
    })


    if(user.role_id != "admin"){
        req.flash('error', `Chỉ có tài khoản Quản Trị Viên được truy cập!`);
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
        return;
    }

    res.locals.user = user;  //đưa user ra local

    next();
}