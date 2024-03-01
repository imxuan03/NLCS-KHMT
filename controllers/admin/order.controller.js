// [GET] /admin/orders 
module.exports.index =  (req, res) => {
    res.render('admin/pages/orders/index', {
        pageTitle: "Trang Chủ"
    })
}