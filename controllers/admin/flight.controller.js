const Flight = require("../../models/flight.model");

const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");

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


    const flights = await Flight.find(find);

    res.render("admin/pages/flights/index",{
        pageTitle: "Dịch Vụ Chuyến Bay",
        flights:flights,
        filterStatus:filterStatus,
        keyword:objectSearch.keyword,
    });
}