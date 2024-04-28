const express = require('express')
const router = express.Router();
const controller = require("../../controllers/client/cart.controller")

router.post('/add/:flightId', controller.addPost)

router.get('/', controller.index)

router.get('/delete/:flightId/:typeTicket', controller.delete)

router.get('/update/:flightId/:quantity/:typeTicket', controller.update)

module.exports = router;