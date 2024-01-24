const express = require('express')
const router = express.Router();

const controller = require("../../controllers/client/service.controller")

router.get('/extendService', controller.extendService)

router.get('/serviceFlight', controller.serviceFlight)
  
module.exports = router;