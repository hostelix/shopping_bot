const jwt = require("jwt-simple");
const moment = require("moment");
const config = require("../config");
const crypto = require("crypto");

const createToken = user => {
  const payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment()
      .add(14, "days")
      .unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

const encryptPassword = data =>
  crypto
    .createHash("md5")
    .update(data)
    .digest("hex");

const checkPassword = (user, password) => {
  const pass2 = encryptPassword(password);

  return user.password === pass2;
};

module.exports = {
  createToken,
  encryptPassword,
  checkPassword
};
