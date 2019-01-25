const Sequelize = require("sequelize");

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
      }
    });
  }
};

module.exports = User;
