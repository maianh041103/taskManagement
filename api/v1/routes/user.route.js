const express = require('express');
const controller = require('../controller/user.controller');
const registerValidate = require('../../validate/register.validate');
const route = express.Router();

route.post('/register', registerValidate.register, controller.register);

module.exports = route;