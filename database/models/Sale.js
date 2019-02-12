const Sequelize = require("sequelize");
const utils = require("../../common/utils");

const Sale = {
  init: sequelize => {
    return sequelize.define("sales", {
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

module.exports = Sale;
