module.exports.login = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Vui lòng nhập email"
    })
    return;
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu"
    })
    return;
  }
  next();
}