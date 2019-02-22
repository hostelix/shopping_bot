const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const config = require("./config/config");
const userController = require("./api/controllers/UserController");
const productController = require("./api/controllers/ProductController");
const authController = require("./api/controllers/AuthController");
const purchaseController = require("./api/controllers/PurchaseController");
const resourceController = require("./api/controllers/ResourceController");
const categoryController = require("./api/controllers/CategoryController");
const statisticsController = require("./api/controllers/StatisticsController");

const app = express();
const bot = require("./bot");

bot.setWebHook(`${config.SERVER_ADDRESS}/bot${config.BOT_TOKEN}`);

app.use(express.static(path.join(__dirname, "./", "build")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

//Bot
app.post(`/bot${config.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

//Api
app.use("/api/auth", authController);
app.use("/api/users", userController);
app.use("/api/products", productController);
app.use("/api/purchases", purchaseController);
app.use("/api/categories", categoryController);
app.use("/api/resources", resourceController);
app.use("/api/statistics", statisticsController);

app.listen(config.SERVER_PORT, () =>
  console.log(`Shopping App running in ${config.SERVER_PORT}`)
);
