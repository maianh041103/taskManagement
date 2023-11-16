const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const port = process.env.PORT;

//Nhúng cors
const cors = require('cors');

//const corsOptions = {
//origin: 'http://example.com',
//}
//app.use(cors(corsOptions));

app.use(cors());
//End nhúng cors

//Connect database
const database = require('./config/database');
database.connect();
//End connect database

//Nhúng bodyParser
app.use(bodyParser.json());

//Nhúng route
const route = require('./api/v1/routes/index.route');
route(app);
//End nhúng route

app.listen(port, () => {
  console.log("app listen on " + port);
})