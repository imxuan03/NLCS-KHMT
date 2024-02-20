const User = require("../../models/user.model");
const generate = require("../../helpers/generate");

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
    req.body.tokenUser = generate.generateRandomString(30);


    const user = new User(req.body);
    await user.save();
    

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");

}
