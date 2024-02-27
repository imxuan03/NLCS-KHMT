const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filter-status");

const md5 = require('md5');
const generate = require("../../helpers/generate");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts 
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);

    const find = {
        deleted: false
    }

    if(req.query.status){
        find.status = req.query.status;
    }
    
    const records = await Account.find(find)
    
    res.render('admin/pages/accounts/index', {
        pageTitle: "Danh Sách Tài Khoản",
        filterStatus:filterStatus,
        records: records,
    })
}

// [GET] /admin/accounts/create 
module.exports.create = async (req, res) => {
    res.render('admin/pages/accounts/create', {
        pageTitle: "Tạo mới tài khoản",
    })
}

// [POST] /admin/accounts/create 
module.exports.createPost = async (req, res) => {

    req.body.password = md5(req.body.password);
    
    //Làm token mới mỗi khi tạo ra một tài khoản mới
    req.body.token = generate.generateRandomString(30);

    // Đặt tên lại theo đường dẫn 
    if(req.file && req.file.filename){
        req.body.avatar = `/uploads/${ req.file.filename}`
    }

    const record = new Account(req.body);
    await record.save();

    req.flash('success', `Thêm tài khoản thành công!`);
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    
    const record = await Account.findOne({
        _id:id,
        deleted:false,
    })

    res.render('admin/pages/accounts/edit', {
        pageTitle: "Chỉnh sửa tài khoản",
        record: record,
    })
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    if(req.body.password){
        req.body.password = md5(req.body.password);
    }else{
        delete req.body.password;
    }

    // Đặt tên lại theo đường dẫn 
    if(req.file && req.file.filename){
        req.body.avatar = `/uploads/${ req.file.filename}`
    }

    await Account.updateOne({_id: req.params.id}, req.body)

    req.flash('success', `Chỉnh sửa tài khoản thành công!`);
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
}

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id;

    //xóa vĩnh viễn
    //await Account.deleteOne({_id: id});
    //xóa mềm
    await Account.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', `Xóa thành công tài khoản!`);
    res.redirect("back");

}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    const record = await Account.findOne({
        _id: req.params.id,
        deleted: false,
    })

    res.render('admin/pages/accounts/detail', {
        pageTitle: "Thông tin chi tiết tài khoản",
        record: record,
    })

}