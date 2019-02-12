const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("sales", {
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

  Sale.associate = models => {};

  return Sale;
};
