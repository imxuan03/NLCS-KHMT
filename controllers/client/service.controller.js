// [GET] /service/extendService
module.exports.extendService =  (req, res) => {
    res.render('client/pages/service/extendService', {
        pageTitle: "Vietjet Air | Dịch vụ khác"
    })
}

// [GET] /service/serviceFlight
module.exports.serviceFlight =  (req, res) => {
    res.render('client/pages/service/serviceFlight', {
        pageTitle: "Vietjet Air | Dịch vụ chuyến bay"
    })
}

