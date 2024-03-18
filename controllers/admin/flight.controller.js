const Flight = require("../../models/flight.model");

const priceHelper = require("../../helpers/price");
const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
// [GET] /admin/flights 
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let objectSearch = searchHelper(req.query);

    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }

    //Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 4
    }
    const countProducts = await Flight.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countProducts);

    //End Pagination

    // Sort 
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // end sort 

    const flights = await Flight.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/flights/index", {
        pageTitle: "Dịch Vụ Chuyến Bay",
        flights: flights,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
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
    res.render("admin/pages/flights/create", {
        pageTitle: "Tạo mới chuyến bay",
    });
}

// [Post] /admin/flights/create
module.exports.createPost = async (req, res) => {
    try {

        //gọi từ Helper price
        let price = priceHelper(req.body);

        req.body.availableSeats = parseInt(req.body.availableSeats);

        if (req.body.position === "") {
            const countFlight = await Flight.countDocuments();
            req.body.position = countFlight + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        //check xem có ảnh gửi lên hay không
        //và đổi tên lại để có thể truy cập vào ảnh
        if (req.file && req.file.filename) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }

        //Quản lí cho đặt các chuyến bay trong tuần lặp lại
        //Hàng tuần vào các thứ nào đó
        const scheduleFlight = req.body.scheduleFlight;

        const startDateRepeteString = req.body.startDateRepete;
        const startDateRepete = new Date(startDateRepeteString);

        const endDateRepeteString = req.body.endDateRepete;
        const endDateRepete = new Date(endDateRepeteString);

        const startMonth = startDateRepete.getMonth();
        const startYear = startDateRepete.getFullYear();
        const startDate = startDateRepete.getDate();

        const endMonth = endDateRepete.getMonth();
        const endYear = endDateRepete.getFullYear();
        const endDate = endDateRepete.getDate();

        let chosenDays = [];
        if (req.body.monday)
            chosenDays.push("1");
        if (req.body.tuesday)
            chosenDays.push("2");
        if (req.body.wednesday)
            chosenDays.push("3");
        if (req.body.thursday)
            chosenDays.push("4");
        if (req.body.friday)
            chosenDays.push("5");
        if (req.body.saturday)
            chosenDays.push("6");
        if (req.body.sunday)
            chosenDays.push("0");
        
        // //=======================================================


        let departureTime = req.body.departureTime;
        let arrivalTime = req.body.arrivalTime;
        // Lặp qua từng ngày từ ngày bắt đầu đến ngày kết thúc
        for (let i = 0; i < Math.min(departureTime.length, arrivalTime.length); i++) {
            // Tạo một đối tượng Date từ ngày bắt đầu
            let currentDate = new Date(startYear, startMonth, startDate);
            while (currentDate <= new Date(endYear, endMonth, endDate)) {
                const dayOfWeek = currentDate.getDay();

                // Kiểm tra nếu là thứ 2 hoặc thứ 3
                if (chosenDays.includes(dayOfWeek.toString())) {
                    req.body.departureTime = departureTime[i];
                    req.body.arrivalTime = arrivalTime[i];

                    // //time bắt đầu
                    let [hourDepart, minuteDepart] = departureTime[i].split(":")
                    hourDepart = parseInt(hourDepart);
                    minuteDepart = parseInt(minuteDepart);

                    //time đến 
                    let [hourArrival, minuteArrival] = arrivalTime[i].split(":")
                    hourArrival = parseInt(hourArrival);
                    minuteArrival = parseInt(minuteArrival);


                    const month = currentDate.getMonth() + 1
                    let stringDateDepart = currentDate.getFullYear() + "-" + month + "-" + currentDate.getDate();
                    req.body.departureDate = stringDateDepart;

                    //tính xem giờ đến nó có thuộc ngày mới hay không
                    let stringDateArrival = "";
                    if (hourArrival < hourDepart) {
                        //nó đã qua ngày hôm sau rồi
                        const currentDateArrival = new Date(currentDate);
                        currentDateArrival.setDate(currentDateArrival.getDate() + 1);

                        const month = currentDateArrival.getMonth() + 1;

                        stringDateArrival = currentDateArrival.getFullYear() + "-" + month + "-" + currentDateArrival.getDate();
                        req.body.arrivalDate = stringDateArrival;
                    } else {
                        //vẫn ngày đó
                        const month = currentDate.getMonth() + 1
                        stringDateArrival = currentDate.getFullYear() + "-" + month + "-" + currentDate.getDate();
                        req.body.arrivalDate = stringDateArrival;
                    }

                    req.body.price = price;
                    const flight = new Flight(req.body);
                    await flight.save();
                }

                // Tăng ngày hiện tại thêm 1 ngày
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        req.flash('success', `Thêm sản phẩm thành công!`);
        res.redirect(`/${systemConfig.prefixAdmin}/flights`)
        // ===================================================

    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi khi tạo chuyến bay:', error);
        req.flash('error', `Đã xảy ra lỗi khi tạo chuyến bay: ${error.message}`);
        res.redirect(`/${systemConfig.prefixAdmin}/flights/create`);
    }
}

// [GET] /admin/flights/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const record = await Flight.findOne({
        _id: id,
        deleted: false,
    })

    res.render("admin/pages/flights/edit", {
        pageTitle: "Chỉnh sửa chuyến bay",
        record: record,
    });
}

// [PATCH] /admin/flights/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const firstPrice = parseInt(req.body.firstPrice);
    const ecoPrice = parseInt(req.body.ecoPrice);
    const businessPrice = parseInt(req.body.businessPrice);
    const vipPrice = parseInt(req.body.vipPrice);


    const price = [
        { priceName: 'firstPrice', price: firstPrice },
        { priceName: 'ecoPrice', price: ecoPrice },
        { priceName: 'businessPrice', price: businessPrice },
        { priceName: 'vipPrice', price: vipPrice }
    ];


    req.body.availableSeats = parseInt(req.body.availableSeats);
    req.body.position = parseInt(req.body.position);

    //check xem có ảnh gửi lên hay không
    //và đổi tên lại để có thể truy cập vào ảnh
    if (req.file && req.file.filename) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }
    req.body.price = price;
    await Flight.updateOne({ _id: id }, req.body);


    req.flash('success', `Chỉnh sửa phẩm thành công!`);
    res.redirect(`/${systemConfig.prefixAdmin}/flights`)
}

// [GET] /admin/flights/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Flight.findOne({
            _id: id,
            deleted: false,
        })

        res.render("admin/pages/flights/detail", {
            pageTitle: "Chi tiết chuyến bay",
            record: record,
        });

    } catch (error) {
        const id = req.params.id;
        req.flash('error', `Không tồn tại sản phẩm có id: ${id}`);
        res.redirect(`/${systemConfig.prefixAdmin}/flights`)
    }
}