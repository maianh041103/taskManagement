const express = require('express');
const controller = require('../controller/user.controller');
const registerValidate = require('../../validate/register.validate');
const loginValidate = require('../../validate/login.validate');
const forgotPasswordValidate = require('../../validate/forgotPassword.validate');
const route = express.Router();

route.post('/register', registerValidate.register, controller.register);

route.post('/login', loginValidate.login, controller.login);

route.post('/password/forgot', forgotPasswordValidate.forgot, controller.forgot);

route.post('/password/otp', controller.otp);

route.post('/password/reset', controller.reset);

route.get('/detail/:id', controller.infoUser);

module.exports = route;