const express = require('express')
const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route");
const mongoose = require('mongoose');
const systemConfig = require("./config/system");
require('dotenv').config() //gọi file .env

mongoose.connect('mongodb://127.0.0.1:27017/flyticket');

const Flight = mongoose.model('Flight', {
  title: String,
  description: String,
  price: Number
})

const port = process.env.PORT;
const app = express()

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