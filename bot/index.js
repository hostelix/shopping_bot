const telegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = require("../server/config").BOT_TOKEN;
const User = require("../server/database/models").User;

const bot = new telegramBot(BOT_TOKEN);

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
      `Bienvenido a shopping bot ${user.first_name} ${user.last_name}`
    );
  });
});

module.exports = bot;
