const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PurchaseProduct = sequelize.define("purchases_products", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    purchase_id: {
      type: Sequelize.INTEGER
    },
    product_id: {
      type: Sequelize.INTEGER
    },
    quantity: {
      type: Sequelize.INTEGER
    }
  });

  PurchaseProduct.associate = models => {
    models.PurchaseProduct.belongsTo(models.Purchase, {
      foreignKey: "purchase_id"
    });

    models.PurchaseProduct.belongsTo(models.Product, {
      foreignKey: "product_id"
    });
  };

  return PurchaseProduct;
};
