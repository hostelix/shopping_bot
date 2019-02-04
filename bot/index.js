const telegramBot = require("node-telegram-bot-api");
const _ = require("lodash");
const BOT_TOKEN = require("../server/config").BOT_TOKEN;
const User = require("../server/database/models").User;
const Category = require("../server/database/models").Category;

const bot = new telegramBot(BOT_TOKEN);

const COMMAND_SHOP = "🏪 Tienda";
const COMMAND_PURCHASES = "🛍 Mis Compras";
const COMMAND_PRODUCTS = "📦 Productos";
const COMMAND_CAR = "🛒 Carrito";
const COMMAND_BACK = "⬅️ Atras";

bot.on("message", message => {
  const { text, chat } = message;

  if (text) {
    switch (text) {
      case COMMAND_BACK:
        bot.sendMessage(chat.id, "back", {
          reply_markup: {
            keyboard: [[COMMAND_SHOP, COMMAND_PURCHASES]]
          }
        });
        break;
      case COMMAND_SHOP:
        bot.sendMessage(chat.id, "Tienda", {
          reply_markup: {
            keyboard: [[COMMAND_PRODUCTS, COMMAND_CAR], [COMMAND_BACK]]
          }
        });
        break;
      case COMMAND_PURCHASES:
        bot.sendMessage(chat.id, "Mis compras", {
          reply_markup: {
            keyboard: [[COMMAND_SHOP, COMMAND_PURCHASES]]
          }
        });
        break;
      case COMMAND_PRODUCTS:
        Category.findAll().then(categories => {
          keyboard = _.chunk(categories.map(c => `[${c.id}] ${c.name}`), 3);
          keyboard.push([COMMAND_BACK]);
          bot.sendMessage(chat.id, "Seleccione una categoria", {
            reply_markup: {
              keyboard: keyboard
            }
          });
        });
        break;
    }
  }
});

bot.onText(/\/start/, message => {
  const { from, chat } = message;
  const { id: chat_id, first_name, last_name, username } = from;

  User.findOrCreate({
    where: { chat_id },
    defaults: {
      chat_id,
      first_name,
      last_name,
      username
    }
  }).spread((user, created) => {
    bot.sendMessage(
      chat.id,
      `Bienvenido a shopping bot ${user.first_name} ${user.last_name}`,
      {
        reply_markup: {
          keyboard: [[COMMAND_SHOP, COMMAND_PURCHASES]]
        }
      }
    );
  });
});

module.exports = bot;
