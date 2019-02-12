const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("products", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resource_id: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.FLOAT
    },
    category_id: {
      type: Sequelize.INTEGER
    }
  });

  Product.associate = models => {
    models.Product.belongsTo(models.Category, { foreignKey: "category_id" });
    models.Product.belongsTo(models.Resource, { foreignKey: "resource_id" });
  };

  return Product;
};
