const express = require('express')
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller")
const checkOutMiddelWare = require("../../middlewares/client/checkout.middleware");

router.get('/',checkOutMiddelWare.checkDayAddFlight, checkOutMiddelWare.checkoutPage, controller.index)

router.post('/order', controller.order)

router.get('/success/:orderId', controller.success)
  
module.exports = router;