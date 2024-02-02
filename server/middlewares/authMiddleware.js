const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, process.env.jwt_secret).userId;
    req.body.userId = userId;

    next();
  } catch (error) {
    // when the token from the localstorage is expired
    res.status(403).send({
      success: false,
      message: "Session expired, token is outdated",
    });
  }
};
