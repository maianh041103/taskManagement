const express = require('express');
const route = express.Router();
const controller = require('../controller/task.controller');

route.get('/', controller.index);

route.get('/detail/:id', controller.detail);

route.patch('/change-status/:id', controller.changeStatus);

module.exports = route;