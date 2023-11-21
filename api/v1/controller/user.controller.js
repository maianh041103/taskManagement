const User = require('../model/user.model');
const ForgotPassword = require('../model/forgot-password.model.js');
const md5 = require('md5');
const generateHelper = require('../../../helper/generate');
const sendEmailHelper = require('../../../helper/sendEmail.js');

//[GET] /api/v1/users/register
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

//[GET] /api/v1/users/login
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

//[GET] /api/v1/users/password/forgot
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
    expireAt: Date.now() + 300000
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

//[POST] /api/v1/users/password/otp
module.exports.otp = async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });
  if (result) {
    const user = await User.findOne({
      email: email
    });

    res.cookie("token", user.token);

    res.json({
      code: 200,
      message: "Mã OTP chính xác",
      token: user.token
    })
  }
  else {
    res.json({
      code: 400,
      message: "Mã OTP không chính xác"
    })
  }
}

//[POST] /api/v1/user/password/reset
module.exports.reset = async (req, res) => {
  const password = req.body.password;
  const token = req.body.token;
  const user = await User.findOne({
    token: token,
    deleted: false
  })
  if (!user) {
    res.json({
      code: 400,
      message: "Tài khoản không tồn tại"
    });
    return;
  }
  if (user.password === md5(password)) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ"
    })
  } else {
    await User.updateOne({
      token: token
    }, {
      password: md5(password)
    });

    res.json({
      code: 200,
      message: "Thay đổi mật khẩu thành công"
    });
  }
}

//[GET] /api/v1/user/detail:is
module.exports.infoUser = async (req, res) => {
  const id = req.params.id;

  res.json({
    code: 200,
    user: req.user
  })
}

//[GET] /api/v1/user/list
module.exports.listUser = async (req, res) => {
  const listUser = await User.find({
    deleted: false
  }).select("-password");

  res.json({
    code: 200,
    listUser: listUser
  })
}