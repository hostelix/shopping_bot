const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const config = require("../../config/config");

/*const sequelize = new Sequelize("shopping_bot", DB_USER, DB_PASSWORD, {
  host: "127.0.0.1",
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});*/
const sequelize = new Sequelize("shopping_bot", null, null, {
  dialect: "sqlite",
  logging: config.LOG_SEQUELIZE,
  storage: path.resolve(__dirname, "../../", "shopping_bot.sqlite3")
});

const excludeFiles = ["index.js"];

// Load each model file
const models = Object.assign(
  {},
  ...fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf(".") !== 0)
    .filter(file => !excludeFiles.includes(file))
    .map(file => {
      if (file) {
        const model = sequelize["import"](path.join(__dirname, file));
        const name = path.basename(file, ".js");
        return { [name]: model };
      }
    })
);

// Load model associations
Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = models;
