const path = require("path");
const Sequelize = require("sequelize");

const config = require("../config/config");

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
  storage: path.resolve(__dirname, "../", "shopping_bot.sqlite3")
});

module.exports = sequelize;
