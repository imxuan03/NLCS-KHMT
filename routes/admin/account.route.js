const express = require('express')
const router = express.Router();
const controller = require("../../controllers/admin/account.controller")
const multer  = require('multer') //dùng để upload ảnh,...

const storageMulterHelper = require("../../helpers/storageMulter");
const storage = storageMulterHelper();

const upload = multer({ storage: storage });

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('avatar'),
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id',
    upload.single('avatar'),
    controller.editPatch
);

router.delete('/delete/:id', controller.deleteAccount);
  
router.get('/detail/:id', controller.detail);

module.exports = router;