const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ShoppingCar = sequelize.define("shopping_car", {
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

  ShoppingCar.associate = models => {
    models.ShoppingCar.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return ShoppingCar;
};
