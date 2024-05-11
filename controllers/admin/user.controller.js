const User = require("../../models/user.model.js");
const filterStatusHelper = require("../../helpers/filter-status");

// [GET] /admin/users/
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);

    const find = {
        deleted: false
    }

    if(req.query.status){
        find.status = req.query.status;
    }
    
    const records = await User.find(find)

    res.render('admin/pages/users/index', {
        pageTitle: "Vietjet Air | Quản lý tài khoản User",
        filterStatus:filterStatus,
        records: records,
    })
}

// [DELETE] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
    const record = await User.findOne({
        _id: req.params.id,
        deleted: false,
    })

    res.render('admin/pages/users/detail', {
        pageTitle: "Vietjet Air | Thông tin chi tiết tài khoản User",
        record: record,
    })

}

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await User.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect("back");
}

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id;

    //xóa vĩnh viễn
    //await Account.deleteOne({_id: id});
    //xóa mềm
    await User.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', `Xóa thành công tài khoản!`);
    res.redirect("back");

}