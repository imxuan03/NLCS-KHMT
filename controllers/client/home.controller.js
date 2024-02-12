const Flight =require("../../models/flight.model");
const paginationHelper = require("../../helpers/pagination");
const searchFEHelper = require("../../helpers/searchFE");
// [GET] / 
module.exports.index = async (req, res) => {
    const objectSearch = searchFEHelper(req.query);

    const find = {
        deleted: false
    }

    //Search FE
    if(req.query.departureCity){
        find.departureCity = objectSearch.regexDepartureCity;
    }

    if(req.query.arrivalCity){
        find.arrivalCity = objectSearch.regexArrivalCity;
    }

    if(req.query.departureDate){
        find.departureDate = objectSearch.departureDate;
    }

    if(req.query.arrivalDate){
        find.arrivalDate = objectSearch.arrivalDate;
    }
    //End Search FE

    //Pagination
    let initPagination = {
        currentPage : 1,
        limitItems: 12
    }
    const countProducts = await Flight.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countProducts);

    //End Pagination

    // Sort 
    let sort= {};

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey]=req.query.sortValue;
    }else{
        sort.price = "desc";
    }
    // end sort 

    const flights = await Flight.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render('client/pages/home/index', {
        pageTitle: "Trang Chủ",
        flights:flights,
        pagination: objectPagination,
    })
}

// [GET] /detail/:slug 
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const record = await Flight.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })
        res.render('client/pages/home/detail', {
            pageTitle: "Chi tiết sản phẩm",
            record:record
        })
    } catch (error) {
        res.redirect("/")
    }
}