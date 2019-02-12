const Sequelize = require("sequelize");

const Resource = {
  init: sequelize => {
    return sequelize.define("resources", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mimetype: {
        type: Sequelize.STRING
      },
      originalname: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      path: {
        type: Sequelize.STRING
      }
    });
  }
};

module.exports = Resource;
