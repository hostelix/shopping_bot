const fs = require("fs");
const path = require("path");
const sequelize = require("../index");

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
