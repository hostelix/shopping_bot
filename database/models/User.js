const Sequelize = require("sequelize");
const utils = require("../../common/utils");

const User = {
  init: sequelize => {
    return sequelize.define("users", {
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
          this.setDataValue(
            "password",
            !!val ? utils.encryptPassword(val) : ""
          );
        }
      }
    });
  }
};

module.exports = User;
