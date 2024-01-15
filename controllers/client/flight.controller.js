module.exports.index = (req, res) => {
    res.render("client/pages/flights/index",{
        pageTitle: "Danh Sách Chuyến Bay"
    });
}