const express = require('express')
const router = express.Router();
const multer  = require('multer') //dùng để upload ảnh,...

const storageMulterHelper = require("../../helpers/storageMulter");
const storage = storageMulterHelper();

const upload = multer({ storage: storage });

const controller = require("../../controllers/admin/my-account.controller")

router.get('/', controller.index);

router.get('/edit', controller.edit);

router.patch(
    '/edit', 
    upload.single('avatar'),
    controller.editPatch
);


module.exports = router;