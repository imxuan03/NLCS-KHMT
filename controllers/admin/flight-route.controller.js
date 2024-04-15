const FlightRoute = require("../../models/flight-route.model");
const systemConfig = require("../../config/system");

// [GET] /admin/flight-routes 
module.exports.index = async (req, res) => {
    const flightRoutes = await FlightRoute.find({deleted:false});

    res.render('admin/pages/flight-routes/index', {
        pageTitle: "Quản Lý Đường Bay",
        flightRoutes: flightRoutes,
    })
}

// [GET] /admin/flight-routes/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/flight-routes/create", {
        pageTitle: "Tạo Mới Đường Bay",
    });
}


// [POST] /admin/flight-routes/create
module.exports.createPost = async (req, res) => {
    try {
        // Kiểm tra xem điểm xuất phát, điểm đến đã tồn tại trong cơ sở dữ liệu chưa (cả đường bay thêm vào)
        const existingRouteAll = await FlightRoute.findOne({ 
            departureCity: req.body.departureCity, 
            arrivalCity: req.body.arrivalCity,
            deleted: false
        });

        if (existingRouteAll) {
            req.flash('error', `Đường bay đã tồn tại!`);
            return res.redirect(`/${systemConfig.prefixAdmin}/flight-routes`);
        }

        //====================================================================
        // Kiểm tra xem điểm xuất phát đã tồn tại trong cơ sở dữ liệu chưa
        const existingRoute = await FlightRoute.findOne({ departureCity: req.body.departureCity, deleted: false});
        if (existingRoute) {
            // Nếu điểm xuất phát đã tồn tại, thêm điểm đến vào bản ghi đã có
            existingRoute.arrivalCity.push(req.body.arrivalCity);
            await existingRoute.save();

            req.flash('success', `Thêm điểm đến "${req.body.arrivalCity}" vào đường bay từ "${req.body.departureCity}" thành công!`);
            return res.redirect(`/${systemConfig.prefixAdmin}/flight-routes`);
        }

        // Nếu không có, bạn có thể tạo một bản ghi mới
        const record = new FlightRoute(req.body);
        await record.save();

        req.flash('success', `Thêm đường bay từ "${req.body.departureCity}" đến "${req.body.arrivalCity}" thành công!`);
        res.redirect(`/${systemConfig.prefixAdmin}/flight-routes`);
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error creating flight route:', error);
        req.flash('error', 'Đã xảy ra lỗi khi thêm đường bay. Vui lòng thử lại sau.');
        res.redirect(`/${systemConfig.prefixAdmin}/flight-routes/create`);
    }
}

// [DELETE] /admin/flight-routes/delete/:id
module.exports.deleteFlightRoute = async (req, res) => {
    const id = req.params.id;

    //xóa vĩnh viễn
    //await Account.deleteOne({_id: id});
    //xóa mềm
    await FlightRoute.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });

    req.flash('success', `Xóa thành công đường bay!`);
    res.redirect("back");
}

// [GET] /admin/flight-routes/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const record = await FlightRoute.findOne({
        _id: id,
        deleted: false,
    })

    res.render("admin/pages/flight-routes/edit", {
        pageTitle: "Chỉnh sửa đường bay",
        record: record,
    });
}


module.exports.editPost = async (req, res) => {
    const flightRouteId = req.params.id;
    const arrivalCityIndex = req.body.arrivalCityIndex;

    try {
        // Lấy ra bản ghi flight route từ cơ sở dữ liệu
        const flightRoute = await FlightRoute.findById(flightRouteId);
        if (!flightRoute) {
            return res.status(404).send('Flight route not found');
        }

        // Xóa điểm đến từ mảng arrivalCity
        flightRoute.arrivalCity.splice(arrivalCityIndex, 1);
        await flightRoute.save();

        req.flash('success', 'Xóa điểm đến thành công');
        res.redirect(`/${systemConfig.prefixAdmin}/flight-routes`);
    } catch (error) {
        console.error('Error deleting arrival city:', error);
        req.flash('error', 'Đã xảy ra lỗi khi xóa điểm đến');
        res.redirect(`/${systemConfig.prefixAdmin}/flight-routes`);
    }
};