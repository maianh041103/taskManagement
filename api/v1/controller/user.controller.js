const User = require('../model/user.model');
const md5 = require('md5');
const generateHelper = require('../../../helper/generate');


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