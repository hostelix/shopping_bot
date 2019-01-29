const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config");

const userController = require("./controllers/UserController");
const productController = require("./controllers/ProductController");
const authController = require("./controllers/AuthController");
const saleController = require("./controllers/SaleController");

const app = express();
const bot = require("../bot");

bot.setWebHook(`${config.SERVER_ADDRESS}/bot${config.BOT_TOKEN}`);

app.use(express.static(path.join(__dirname, "../", "build")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
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
app.use("/api/sales", saleController);

app.listen(config.SERVER_PORT, () =>
  console.log(`Shopping App running in ${config.SERVER_PORT}`)
);
