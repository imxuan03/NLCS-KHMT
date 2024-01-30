// [GET] /myflight
module.exports.index =  (req, res) => {
    res.render('client/pages/myflight/index', {
        pageTitle: "Chuyến bay của tôi"
    })
}

