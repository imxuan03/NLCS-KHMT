const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Flight = require("../../models/flight.model");

const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");

// [GET] /user/register
module.exports.register =  (req, res) => {
    
    res.render('client/pages/user/register', {
        pageTitle: "Đăng ký tài khoản"
    })
}


// [Post] /user/register
module.exports.registerPost = async  (req, res) => {
    
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted:false
    })

    if(existEmail){
        req.flash('error', `Email đã tồn tại!`);
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    //Làm token mới mỗi khi tạo ra một tài khoản mới
    req.body.tokenUser = generateHelper.generateRandomString(30);


    const user = new User(req.body);
    await user.save();
    

    res.cookie("tokenUser", user.tokenUser);


    //Lưu user_id vào collection carts
    await Cart.updateOne(
        {
            _id: req.cookies.cartId
        },{
            user_id: user.id
        }
    )
    //Lưu cart_id vào collection user
            //Lưu user_id vào collection carts
    await User.updateOne(
        {
            _id: user.id
        },{
            cart_id: req.cookies.cartId
        }
    )

    res.redirect("/");

}

// [GET] /user/login
module.exports.login =  (req, res) => {
    
    res.render('client/pages/user/login', {
        pageTitle: "Đăng nhập tài khoản"
    })
}

// [POST] /user/login
module.exports.loginPost = async  (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email:email,
        deleted:false,
    })

    if(!user){
        req.flash('error', `Email không tồn tại!`);
        res.redirect("back");
        return;
    }

    if(user.password != md5(password)){
        req.flash('error', `Sai mật khẩu!`);
        res.redirect("back");
        return;
    }
    if(user.status == "inactive"){
        req.flash('error', `Tài khoản bị khóa!`);
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    if(user.cart_id){
        res.cookie("cartId",user.cart_id);
    }

    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout =  (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    
    res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword =  (req, res) => {
    res.render('client/pages/user/forgot-password', {
        pageTitle: "Quên mật khẩu"
    })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email:email,
        deleted:false,
    })

    if(!user){
        req.flash('error', `Email không tồn tại!`);
        res.redirect("back");
        return;
    }

    // Việc 1: tạo mã OTP, email và lưu thông tin yêu cầu vào collection forgot-password
    const otp = generateHelper.generateRandomNumber(8);
    const objectForgotPassword = {
        email: email,
        otp:otp,
        expireAt: Date.now()
    }
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Việc 2: Gửi mã otp qua email 
    const subject = `Mã OTP xác minh lấy lại mật khẩu tài khoản VietJetAir`
    const html = `
        Mã OTP xác minh lấy lại mật khẩu tài khoản VietJetAir là <b>${otp}</b>. Thời hạn sử dụng là 3 phút.
        Lưu ý mã OTP là bảo mật, không được chia sẽ người lạ.
    `;

    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);

    // res.send("ok")
}

// [GET] /user/password/otp
module.exports.otpPassword =  (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password",{
        pageTitle: "Nhập mã OTP",
        email:email
    });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    })

    if(!result){
        req.flash('error', `OTP không hợp lệ`);
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email:email
    })

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async  (req, res) => {
  
    res.render("client/pages/user/reset-password",{
        pageTitle: "Đổi mật khẩu"
    });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async  (req, res) => {
  
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne(
        {
            tokenUser:tokenUser
        },
        {
            password: md5(password)
        }
    );
    req.flash('success', `Đổi mật khẩu thành công!`);
    res.redirect("/");
}

// [GET] /user/infor
module.exports.infor = async  (req, res) => {
  
    res.render("client/pages/user/infor",{
        pageTitle: "Thông tin cá nhân"
    });
}

// [GET] /user/edit
module.exports.edit = async  (req, res) => {
  
    res.render("client/pages/user/edit",{
        pageTitle: "Cập nhật thông tin cá nhân"
    });
}


// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    if(req.body.password){
        req.body.password = md5( req.body.password);
    }else{
        delete req.body.password;
    }

    // Đặt tên lại theo đường dẫn 
    if(req.file && req.file.filename){
        req.body.avatar = `/uploads/${ req.file.filename}`
    }

    await User.updateOne({_id: res.locals.user.id}, req.body)

    req.flash('success', `Chỉnh sửa tài khoản thành công!`);
    res.redirect(`/user/infor`);
}

// [GET] /user/myflight
module.exports.myflight = async  (req, res) => {
    if(req.cookies.tokenUser){
        var user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        }).select("-password");

        if(user){
            res.locals.user = user;
        }
    }

    //truy cập vào Cart (user_id) -> truy cập vào Order (cart_id)

    const cart = await Cart.findOne({
        user_id: user.id
    })

    
    const orders = await Order.find({
        cart_id: cart.id,
    })

    //Để lấy thông tin order đó (user, .....)
    const order = await Order.findOne({
        cart_id: cart.id,
    })


    //chạy cho nhiều đơn order khác nhau, nhưng cùng một user order
    let totalOrder = 0;
    let flights = []; // lưu một mảng các order từ các đơn hàng khác nhau, nhưng cùng một user order
    for(const eachOrder of orders){
        for(const flight of eachOrder.flights){
            const flightInfor = await Flight.findOne({
                _id: flight.flight_id
            });

            //thêm key vào mỗi flight trong flights
            flight.flightInfor = flightInfor;
            flight.totalPrice = flight.quantity * flight.price;

            flights.push(flight);

        }
        totalOrder += eachOrder.flights.reduce((sum, item) => sum+item.totalPrice, 0);
       
    }

    orders.totalPrice = totalOrder;
    
    res.render("client/pages/user/myflight",{
        pageTitle: "Chuyến bay của tôi",
        flights:flights,
        order:order,
        totalOrder:orders.totalPrice,
    });
}
