const Flight =require("../../models/flight.model");
const Order = require("../../models/order.model");
const paginationHelper = require("../../helpers/pagination");
const searchFEHelper = require("../../helpers/searchFE");
// [GET] /home
module.exports.index = async (req, res) => {
    const objectSearch = searchFEHelper(req.query);

    const find = {
        deleted: false,
        status: "active",
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

// [GET] /home/detail/:slug 
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const record = await Flight.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })

        // #####################################################################
        // ràng buộc số lượng vé khi add cart
        const orders = await Order.find({});

        let orderedQuantity = {}
        orderedQuantity.orderedFirstPriceQuantity= 0;
        orderedQuantity.orderedEcoPriceQuantity= 0;
        orderedQuantity.orderedBusinessPriceQuantity= 0;
        orderedQuantity.orderedVipPriceQuantity= 0;

        orders.forEach(order => {
            order.flights.forEach(flight => {
                if(flight.typeTicket == 'firstPrice' && record._id == flight.flight_id){
                    orderedQuantity.orderedFirstPriceQuantity+=flight.quantity;
                }else if(flight.typeTicket == 'ecoPrice' && record._id == flight.flight_id){
                    orderedQuantity.orderedEcoPriceQuantity+=flight.quantity;
                }else if(flight.typeTicket == 'businessPrice' && record._id == flight.flight_id){
                    orderedQuantity.orderedBusinessPriceQuantity+=flight.quantity;
                }else if(flight.typeTicket == 'vipPrice' && record._id == flight.flight_id){
                    orderedQuantity.orderedVipPriceQuantity+=flight.quantity;
                }
            });
    
        });


        // #####################################################################





        res.render('client/pages/home/detail', {
            pageTitle: "Chi tiết sản phẩm",
            record:record,
            orderedQuantity:orderedQuantity,
        })
    } catch (error) {
        res.redirect("/home")
    }
}