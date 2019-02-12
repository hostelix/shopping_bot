const Sequelize = require("sequelize");

const Category = {
  init: sequelize => {
    return sequelize.define("categories", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
  }
};

module.exports = Category;
