const express = require('express')
const router = express.Router();

const controller = require("../../controllers/client/myflight.controller")

router.get('/', controller.index)
  
module.exports = router;