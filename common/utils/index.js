const jwt = require("jwt-simple");
const moment = require("moment");
const crypto = require("crypto");
const config = require("../../config/config");

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

const requests = (resource, options = {}) => {
  const url = config.BASE_API_URL + resource;
  return fetch(url, options);
};

module.exports = {
  createToken,
  encryptPassword,
  checkPassword
};
