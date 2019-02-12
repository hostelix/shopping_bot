const Sequelize = require("sequelize");

const ShoppingCar = {
  init: sequelize => {
    return sequelize.define("shopping_car", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      }
    });
  }
};

module.exports = ShoppingCar;
