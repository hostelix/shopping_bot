const models = require("./models");

Object.keys(models).forEach(key => {
  models[key].sync();
});
