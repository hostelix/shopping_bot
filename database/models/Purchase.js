const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define("purchases", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    total_amount: {
      type: Sequelize.FLOAT
    },
    address_shipping: {
      type: Sequelize.STRING
    }
  });

  Purchase.associate = models => {
    models.Purchase.belongsTo(models.User, { foreignKey: "user_id" });
    models.Purchase.belongsToMany(models.Product, {
      as: "Products",
      through: { model: models.PurchaseProduct, unique: false },
      foreignKey: "purchase_id",
      otherKey: "product_id"
    });
  };

  return Purchase;
};
