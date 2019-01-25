const Sequelize = require("sequelize");

const Product = {
  init: sequelize => {
    return sequelize.define("products", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.INTEGER,
        unique: true
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      }
    });
  }
};

module.exports = Product;