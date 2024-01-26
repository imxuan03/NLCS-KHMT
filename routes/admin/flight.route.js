const express = require('express')
const router = express.Router();
const controller = require("../../controllers/admin/flight.controller")
const validate = require("../../validates/admin/flight.validate");
const multer  = require('multer') //dùng để upload ảnh,...

const storageMulterHelper = require("../../helpers/storageMulter");
const storage = storageMulterHelper();

const upload = multer({ storage: storage });

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get("/create", controller.create);

router.post(
    "/create", 
    upload.single('thumbnail'),
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single('thumbnail'),
    validate.createPost,
    controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;