const User = require('../model/user.model');

module.exports.auth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const user = await User.findOne({
      token: token,
      deleted: false
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền truy cập vào đây"
      });
    }
  }
  else {
    res.json({
      code: 403,
      message: "Bạn không có quyền truy cập vào đây"
    });
  }
}