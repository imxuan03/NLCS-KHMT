// [GET] /fligts 
module.exports.index = (req, res) => {
    res.render("client/pages/flights/index",{
        pageTitle: "Dịch Vụ Chuyến Bay"
    });
}