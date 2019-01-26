const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const telegramBot = require("node-telegram-bot-api");

const userController = require("./controllers/UserController");
const productController = require("./controllers/ProductController");
const authController = require("./controllers/AuthController");

const BOT_TOKEN = require("./config").BOT_TOKEN;

const app = express();
//const bot = new telegramBot(BOT_TOKEN, { polling: true });

app.use(express.static(path.join(__dirname, "../", "build")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

//Api
app.use("/api/auth", authController);
app.use("/api/users", userController);
app.use("/api/products", productController);

app.listen(4000);
