const express = require("express");
const utils = require("../../common/utils");
const { User } = require("../../database/models");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ where: { username: username } }).then(user => {
    if (user === null) {
      res.status(403).json({
        error: "user or password is invalid"
      });
    } else {
      if (utils.checkPassword(user, password)) {
        res.status(200).json({
          token: utils.createToken(user)
        });
      } else {
        res.status(403).json({
          error: "user or password is invalid"
        });
      }
    }
  });
});

module.exports = router;
