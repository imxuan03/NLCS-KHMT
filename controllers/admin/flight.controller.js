const Flight = require("../../models/flight.model");

const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/flights 
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let objectSearch = searchHelper(req.query);

    const find = {
        deleted: false
    }

    if(req.query.status){
        find.status = req.query.status;
    }

    if(req.query.keyword){
        find.title = objectSearch.regex;
    }

    //Pagination
    let initPagination = {
        currentPage : 1,
        limitItems: 4
    }
    const countProducts = await Flight.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countProducts);

    //End Pagination

    const flights = await Flight.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/flights/index",{
        pageTitle: "Dịch Vụ Chuyến Bay",
        flights:flights,
        filterStatus:filterStatus,
        keyword:objectSearch.keyword,
        pagination: objectPagination
    });
}


// [PATCH] /admin/flights/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Flight.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect("back");
}

// [PATCH] /admin/flights/change-multi
module.exports.changeMulti = async (req, res) => {
    //Cách viết 1 
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    //Cách viết 2
    // const  { type, ids} = req.body;

    // console.log(type);
    // console.log(ids);

    switch (type) {
        case "active":
        case "inactive":
            await Flight.updateMany({ _id: { $in: ids } }, { status: type })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Flight.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            })
            req.flash('success', `Xóa trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                // console.log(item.split("-"));
                const [id, position] = item.split("-");
                // console.log(id);
                // console.log(position);
                await Flight.updateOne({ _id: id }, { position: position });
            }
            req.flash('success', `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }

    res.redirect("back");
}

// [DELETE] /admin/flights/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    //xóa vĩnh viễn
    //await Product.deleteOne({_id: id});
    //xóa mềm
    await Flight.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', `Xóa trạng thái thành công sản phẩm!`);
    res.redirect("back");

}

// [GET] /admin/flights/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/flights/create",{
        pageTitle: "Tạo mới chuyến bay",
    });
}