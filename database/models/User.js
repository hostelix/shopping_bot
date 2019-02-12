const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_id: {
      type: Sequelize.INTEGER,
      unique: true
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      set(val) {
        this.setDataValue("password", !!val ? utils.encryptPassword(val) : "");
      }
    }
  });

  User.associate = models => {};

  return User;
};
