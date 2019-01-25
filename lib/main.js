const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const UserController = require("./controllers/UserController");
const ProductController = require("./controllers/ProductController");
const AuthController = require("./controllers/AuthController");

const BOT_TOKEN = require("./config").BOT_TOKEN;

const app = express();
//const bot = new TelegramBot(BOT_TOKEN, { polling: true });

app.get("/", (req, res) => {
  res.send("Hello world");
});

//Api
app.use("/api/auth", AuthController);
app.use("/api/users", UserController);
app.use("/api/products", ProductController);

app.listen(4000);
