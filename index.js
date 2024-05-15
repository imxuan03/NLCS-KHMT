const express = require('express')
const mongoose = require('mongoose');
const methodOverride = require('method-override'); //dùng để override PATCH, PUT,DELETE...
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');
validationResult = require('express-validator');
const validator = require('validator');


require('dotenv').config() //gọi file .env

const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
const database = require("./config/database");

database.connect(); //Gọi hàm connect để kết nối database


const port = process.env.PORT;
const app = express();

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('public'))
// ví dụ:  override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// flash 
app.use(cookieParser('NHAKDLZNX'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash 

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE

// parse application/x-www-form-urlencoded
//https://www.npmjs.com/package/body-parser
app.use(bodyParser.urlencoded({ extended: false }))


//Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
//End Variables

//=====================================
//làm sạch dữ liệu, lỗ hỏng XSS, NoSQL Injection

// Middleware để làm sạch dữ liệu đầu vào
const sanitizeInput = (req, res, next) => {
  // Làm sạch các trường dữ liệu của yêu cầu
  for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
          req.body[key] = validator.escape(req.body[key].trim());
          // console.log(req.body[key])
      }
  }
  next();
};

// Sử dụng middleware sanitizeInput cho tất cả các route
app.use(sanitizeInput);
// end làm sạch dữ liệu, lỗ hỏng XSS, NoSQL Injection
//===============================

// Routes 
route(app);
routeAdmin(app);

//route cho trang 404 not found
app.get("*", (req, res)=>{
  res.render("admin/pages/notfound/404",{
    pageTitle: "404 Not Found",
  });
});
// End Routes 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})