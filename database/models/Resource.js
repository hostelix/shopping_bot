const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define("resources", {
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

  Resource.associate = models => {};

  return Resource;
};
