const express = require('express')
const mongoose = require('mongoose');

require('dotenv').config() //gọi file .env

const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
const database = require("./config/database");

database.connect(); //Gọi hàm connect để kết nối database



// const Flight = mongoose.model('Flight', {
//   title: String,
//   description: String,
//   price: Number
// })

const port = process.env.PORT;
const app = express();

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('public'))

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