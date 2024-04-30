const express = require('express')
const router = express.Router();
const controller = require("../../controllers/client/cart.controller")
const cartMiddleWare = require("../../middlewares/client/cart.middleware")

router.post('/add/:flightId', controller.addPost)

router.get('/',cartMiddleWare.reload, controller.index)

router.get('/delete/:flightId/:typeTicket', controller.delete)

router.get('/update/:flightId/:quantity/:typeTicket', controller.update)

module.exports = router;