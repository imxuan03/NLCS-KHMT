const express = require('express')
const router = express.Router();
const controller = require("../../controllers/admin/flight-route.controller")

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', controller.createPost);

router.delete('/delete/:id', controller.deleteFlightRoute);

router.get('/edit/:id', controller.edit);

router.post("/:id/delete-arrivalCity", controller.editPost);
  
module.exports = router;