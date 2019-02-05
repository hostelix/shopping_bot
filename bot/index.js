const fs = require("fs");
const telegramBot = require("node-telegram-bot-api");
const _ = require("lodash");
const BOT_TOKEN = require("../server/config").BOT_TOKEN;
const User = require("../server/database/models").User;
const Category = require("../server/database/models").Category;
const Product = require("../server/database/models").Product;
const Resource = require("../server/database/models").Resource;
const ShoppingCar = require("../server/database/models").ShoppingCar;

const bot = new telegramBot(BOT_TOKEN);

const COMMAND_SHOP = "🏪 Tienda";
const COMMAND_PURCHASES = "🛍 Mis Compras";
const COMMAND_PRODUCTS = "📦 Productos";
const COMMAND_CAR = "🛒 Carrito";
const COMMAND_BACK = "⬅️ Atras";
const SYMBOL_CATEGORY = "✔";
const regexCategory = /\(([^)]+)\)/;
const regexCallbackQuery = /^(\w+[a-zA-Z0-9])\@(\w+[a-zA-Z0-9])\:(\w+[a-zA-Z0-9]|\d)$/;
const SYMBOL_CURRENCY = "USD";

bot.on("message", message => {
  const { text, chat } = message;

  if (text) {
    if (text.startsWith(SYMBOL_CATEGORY)) {
      const [, idCategory] = text.match(regexCategory);

      Product.findAll({ where: { category_id: idCategory } }).then(products => {
        products.forEach(product => {
          Resource.findByPk(product.resource_id).then(resource => {
            bot.sendPhoto(chat.id, fs.createReadStream(resource.path), {
              caption: `
📦 Producto: ${product.name}
ℹ️ Descripcion: ${product.description}
💰 Precio: ${product.price} ${SYMBOL_CURRENCY}`,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Agregar al Carrito",
                      callback_data: `product@add_car:${product.id}`
                    }
                  ]
                ]
              }
            });
          });
        });
      });

      return;
    }

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
      case COMMAND_CAR:
        User.findOne({ where: { chat_id: chat.id } }).then(user => {
          ShoppingCar.findAll({ where: { user_id: user.id } })
            .then(data => {
              let msg = "";

              data.forEach(scar => {
                //Product.findByPk(scar.product_id).then(product => {
                msg +=
                  `` +
                  `<strong>Producto:</strong> ${scar.product_id}\n` +
                  `<strong>Cantidad:</strong> ${scar.quantity}\n\n` +
                  `---------------------------------------------\n\n`;
                //});
              });
              return msg;
            })
            .then(m => {
              bot.sendMessage(chat.id, m, { parse_mode: "HTML" });
            });
        });

        break;
      case COMMAND_PRODUCTS:
        Category.findAll().then(categories => {
          keyboard = _.chunk(
            categories.map(c => `${SYMBOL_CATEGORY} (${c.id}) ${c.name}`),
            3
          );
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

bot.on("callback_query", message => {
  const { data: query, from, chat } = message;
  const match = query.match(regexCallbackQuery);
  const [, namespace, action, params] = match;

  if (namespace === "product" && action === "add_car") {
    User.findOne({ where: { chat_id: from.id } }).then(user => {
      ShoppingCar.create({
        user_id: user.id,
        product_id: params,
        quantity: 0
      }).then(() => {
        bot.sendMessage(from.id, `Producto agregado al carrito`);
      });
    });
    console.log(message);
  }
});

module.exports = bot;
