const Sequelize = require("sequelize");

const Product = {
  init: sequelize => {
    return sequelize.define("products", {
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
  }
};

module.exports = Product;
