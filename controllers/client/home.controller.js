const Flight =require("../../models/flight.model");
// [GET] / 
module.exports.index = async (req, res) => {
    const flights = await Flight.find({});
    
    res.render('client/pages/home/index', {
        pageTitle: "Trang Chủ",
        flights:flights,
    })
}