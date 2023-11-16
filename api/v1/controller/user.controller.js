const User = require('../model/user.model');
const ForgotPassword = require('../model/forgot-password.model.js');
const md5 = require('md5');
const generateHelper = require('../../../helper/generate');
const sendEmailHelper = require('../../../helper/sendEmail.js');


module.exports.register = async (req, res) => {
  const userInfo = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    token: generateHelper.generateRandomString(30)
  }

  const emailExist = await User.findOne({
    email: userInfo.email,
    deleted: false
  });

  if (emailExist) {
    res.json({
      code: 400,
      message: "Email đã tồn tại"
    });
    return;
  }

  const user = new User(userInfo);
  await user.save();

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Đăng ký tài khoản thành công"
  })
}

module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Tài khoản không tồn tại"
    })
    return;
  }

  if (user.password != md5(password)) {
    res.json({
      code: 400,
      message: "Mật khẩu không chính xác"
    })
    return;
  }

  res.cookie("token", user.token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    token: user.token
  })
}

module.exports.forgot = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại"
    });
    return;
  }

  const objectForgotPassword = {
    email: email,
    otp: generateHelper.generateRandomNumber(8),
    expireAt: Date.now() + 300
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Gửi mail 
  const subject = "Mã OTP đổi mật khẩu";
  const html = `
      Mã OTP : <b style="color:green">${objectForgotPassword.otp}</b>
  `
  sendEmailHelper.sendEmail(res, email, subject, html);

  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email"
  })
}