const Account = require("../../models/account.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");

// [GET] /admin/my-account 
module.exports.index =  (req, res) => {
    res.render('admin/pages/my-account/index', {
        pageTitle: "Vietjet Air | Thông Tin Cá Nhân"
    })
}

// [GET] /admin/my-account/edit 
module.exports.edit =  (req, res) => {
    res.render('admin/pages/my-account/edit', {
        pageTitle: "Vietjet Air | Chỉnh sửa thông tin cá nhân"
    })
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    if(req.body.password){
        req.body.password = md5( req.body.password);
    }else{
        delete req.body.password;
    }

    // Đặt tên lại theo đường dẫn 
    if(req.file && req.file.filename){
        req.body.avatar = `/uploads/${ req.file.filename}`
    }

    await Account.updateOne({_id: res.locals.user.id}, req.body)

    req.flash('success', `Chỉnh sửa tài khoản thành công!`);
    res.redirect(`/${systemConfig.prefixAdmin}/my-account`)
}