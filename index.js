const express = require('express')
const route = require("./routes/client/index.route") //gọi route
const mongoose = require('mongoose');
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

// Routes 
route(app);
// End Routes 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})