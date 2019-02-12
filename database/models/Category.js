const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("categories", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  Category.associate = models => {
    models.Category.hasMany(models.Product, {
      as: "Products",
      foreignKey: "category_id"
    });
  };

  return Category;
};
