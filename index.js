const express = require('express');
require("dotenv").config();

const app = express();
const port = process.env.PORT;

//Connect database
const database = require('./config/database');
database.connect();
//End connect database

const Task = require('./api/v1/model/task.model');

//Nhúng route
const route = require('./api/v1/routes/index.route');
route(app);
//End nhúng route

app.listen(port, () => {
  console.log("app listen on " + port);
})