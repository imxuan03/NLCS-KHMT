const Flight =require("../../models/flight.model");
const paginationHelper = require("../../helpers/pagination");
// [GET] / 
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

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



