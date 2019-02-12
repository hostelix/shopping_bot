const fs = require("fs");
const telegramBot = require("node-telegram-bot-api");
const _ = require("lodash");
const redis = require("redis");

const { BOT_TOKEN } = require("../config/config");
const { table } = require("table");

const {
  User,
  Category,
  Product,
  Resource,
  ShoppingCar
} = require("../database/models");

const SessionManager = require("./session");

const clientRedis = redis.createClient();
const bot = new telegramBot(BOT_TOKEN);
const session = SessionManager(clientRedis);

//Commands
const COMMAND_SHOP = "🏪 Tienda";
const COMMAND_PURCHASES = "🛍 Mis Compras";
const COMMAND_CONFIRM_PURCHASE = "✅ Confirmar compra";
const COMMAND_CANCEL_PURCHASE = "❌ Cancelar compra";
const COMMAND_PRODUCTS = "📦 Productos";
const COMMAND_CAR = "🛒 Carrito";
const COMMAND_BACK = "⬅️ Atras";

//Actions
const ACTION_SET_QUANTITY_PRODUCT = "set_quantity_product";
const ACTION_SET_ADDRESS_SHIPPING = "set_address_shipping";

const SYMBOL_CATEGORY = "✔";
const SYMBOL_CURRENCY = "USD";

const regexCategory = /\(([^)]+)\)/;
const regexCallbackQuery = /^(\w+[a-zA-Z0-9])\@(\w+[a-zA-Z0-9])\:(\w+[a-zA-Z0-9]|\d)$/;

bot.on("message", message => {
  const { text, chat } = message;
  const sessionKey = `${chat.id}`;

  session.get(sessionKey).then(data => {
    const { action, context } = data;

    switch (action) {
      case ACTION_SET_QUANTITY_PRODUCT:
        const { product_id, user_id } = context;

        ShoppingCar.create({
          user_id: user_id,
          product_id: product_id,
          quantity: parseInt(text)
        })
          .then(() => session.set(sessionKey, { context }))
          .then(() => bot.sendMessage(chat.id, `Producto agregado al carrito`));

        break;
      case ACTION_SET_ADDRESS_SHIPPING:
        break;
    }
  });

  if (text) {
    if (text.startsWith(SYMBOL_CATEGORY)) {
      const [, idCategory] = text.match(regexCategory);

      Product.findAll({
        where: { category_id: idCategory },
        include: [{ model: Resource, as: "resource" }]
      }).then(products => {
        products.forEach(product => {
          bot.sendPhoto(chat.id, fs.createReadStream(product.resource.path), {
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
      case COMMAND_CONFIRM_PURCHASE:
        session
          .set(`${chat.id}`, {
            action: ACTION_SET_ADDRESS_SHIPPING
          })
          .then(() =>
            bot.sendMessage(
              chat.id,
              "Escriba la direccion donde se enviara su compra",
              {
                reply_markup: {
                  keyboard: [[COMMAND_PRODUCTS, COMMAND_CAR], [COMMAND_BACK]]
                }
              }
            )
          );

        break;
      case COMMAND_CANCEL_PURCHASE:
        User.findOne({ where: { chat_id: chat.id } }).then(user => {
          ShoppingCar.destroy({ where: { user_id: user.id } }).then(() => {
            bot.sendMessage(chat.id, "Compra cancelada con exito", {
              reply_markup: {
                keyboard: [[COMMAND_PRODUCTS, COMMAND_CAR], [COMMAND_BACK]]
              }
            });
          });
        });

        break;
      case COMMAND_CAR:
        const tableCar = [["Producto", "Precio", "Cantidad"]];

        User.findOne({ where: { chat_id: chat.id } }).then(user => {
          ShoppingCar.findAll({
            where: { user_id: user.id },
            include: [{ model: Product, as: "product" }]
          })
            .then(data => {
              let msg = "";

              if (data.length > 0) {
                data.forEach(scar => {
                  tableCar.push([scar.product_id, 0, scar.quantity]);
                });
              } else {
                msg = "El carrito se encuentra vacio";
              }

              return "<pre>" + table(tableCar) + "</pre>";
            })
            .then(m => {
              bot.sendMessage(chat.id, m, {
                parse_mode: "HTML",
                reply_markup: {
                  keyboard: [
                    [COMMAND_CONFIRM_PURCHASE, COMMAND_CANCEL_PURCHASE],
                    [COMMAND_BACK]
                  ]
                }
              });
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

bot.on("callback_query", msg => {
  const { data: query, from, message } = msg;
  const match = query.match(regexCallbackQuery);
  const [, namespace, action, params] = match;

  if (namespace === "product" && action === "add_car") {
    const { chat } = message;
    User.findOne({ where: { chat_id: chat.id } })
      .then(user =>
        session.set(`${chat.id}`, {
          action: ACTION_SET_QUANTITY_PRODUCT,
          context: { product_id: params, user_id: user.id }
        })
      )
      .then(() => {
        bot.sendMessage(chat.id, "Escriba la cantidad que desea comprar");
      });
  }
});

module.exports = bot;
