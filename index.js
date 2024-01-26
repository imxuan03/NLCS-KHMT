const express = require('express')
const mongoose = require('mongoose');
const methodOverride = require('method-override'); //dùng để override PATCH, PUT,DELETE...
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');


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

// Routes 
route(app);
routeAdmin(app);
// End Routes 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})