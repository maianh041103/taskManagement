module.exports.forgot = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Vui lòng nhập email"
    });
    return;
  }
  next();
}