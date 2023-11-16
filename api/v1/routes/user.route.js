const express = require('express');
const controller = require('../controller/user.controller');
const registerValidate = require('../../validate/register.validate');
const loginValidate = require('../../validate/login.validate');
const route = express.Router();

route.post('/register', registerValidate.register, controller.register);

route.post('/login', loginValidate.login, controller.login);

module.exports = route;