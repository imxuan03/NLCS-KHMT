const express = require('express')
const router = express.Router();
const multer  = require('multer') //dùng để upload ảnh,...

const storageMulterHelper = require("../../helpers/storageMulter");
const storage = storageMulterHelper();

const upload = multer({ storage: storage });

const controller = require("../../controllers/client/user.controller")

//validate
const validate = require("../../validates/client/user.validate");
const authMiddleWare = require("../../middlewares/client/auth.middleware");

router.get('/register', controller.register);

router.post(
    '/register', 
    validate.registerPost,
    controller.registerPost
);
  
router.get('/login', controller.login);

router.post(
    '/login', 
    validate.loginPost,
    controller.loginPost
);

router.get('/logout', controller.logout);

router.get('/password/forgot', controller.forgotPassword);

router.post(
    '/password/forgot', 
    validate.forgotPasswordPost,
    controller.forgotPasswordPost
);

router.get('/password/otp', controller.otpPassword);

router.post('/password/otp', controller.otpPasswordPost);

router.get('/password/reset', controller.resetPassword);

router.post
    ('/password/reset', 
    validate.resetPasswordPost,
    controller.resetPasswordPost
);

router.get('/infor',authMiddleWare.requireAuth, controller.infor);

router.get('/edit',authMiddleWare.requireAuth, controller.edit);

router.patch(
    '/edit', 
    upload.single('avatar'),
    authMiddleWare.requireAuth,
    controller.editPatch
);

router.get('/myflight',authMiddleWare.requireAuth, controller.myflight);


module.exports = router;