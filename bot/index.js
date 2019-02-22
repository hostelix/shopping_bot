const fs = require("fs");
const telegramBot = require("node-telegram-bot-api");
const _ = require("lodash");
const redis = require("redis");
const { table } = require("table");
const path = require("path");
const db = require("../database");
const utils = require("../common/utils");

const { BOT_TOKEN } = require("../config/config");

const LIMIT_PRODUCTS = 1;

const {
  User,
  Category,
  Product,
  Resource,
  Purchase,
  ShoppingCar,
  PurchaseProduct
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
const ACTION_NONE = "none";
const ACTION_SET_QUANTITY_PRODUCT = "set_quantity_product";
const ACTION_SET_ADDRESS_SHIPPING = "set_address_shipping";

const SYMBOL_CATEGORY = "✔";
const SYMBOL_CURRENCY = "USD";

const regexCategory = /\(([^)]+)\)/;
//^(\w+[a-zA-Z0-9])\@(\w+[a-zA-Z0-9])\:(\w+[a-zA-Z0-9]|\d)\|?(\w+[a-zA-Z0-9]|\d)$
const regexCallbackQuery = /^(\w+[a-zA-Z0-9])\@(\w+[a-zA-Z0-9])\:(\w+[a-zA-Z0-9]|\d)$/;

bot.on("message", message => {
  const { text, chat, from } = message;
  const sessionKey = `${from.id}:${chat.id}`;

  session.get(sessionKey).then(data => {
    const { action, context } = data;
    const { product_id, user_id } = context;

    switch (action) {
      case ACTION_SET_QUANTITY_PRODUCT:
        ShoppingCar.create({
          user_id: user_id,
          product_id: product_id,
          quantity: parseInt(text)
        })
          .then(() =>
            session.update(sessionKey, { action: ACTION_NONE, context })
          )
          .then(() => bot.sendMessage(chat.id, `Producto agregado al carrito`));

        break;
      case ACTION_SET_ADDRESS_SHIPPING:
        const address_shipping = text;
        let total_amount = 0;

        ShoppingCar.findAll({
          where: { user_id },
          include: [{ model: Product, as: "product" }]
        }).then(results => {
          total_amount = results.reduce(
            (acc, res) => acc + res.quantity * res.product.price,
            0
          );
          Purchase.create({
            user_id,
            address_shipping,
            total_amount
          })
            .then(purchase => {
              results.forEach(item => {
                purchase.addProduct(item.product, {
                  through: { quantity: item.quantity }
                });
              });

              return ShoppingCar.destroy({ where: { user_id } });
            })
            .then(() => {
              bot.sendMessage(
                chat.id,
                `Compra finalizada, su pedido sera enviado a <b>${address_shipping}</b>`,
                {
                  parse_mode: "HTML"
                }
              );
              return session.set(sessionKey, {
                action: ACTION_NONE,
                context: { user_id }
              });
            });
        });
        break;
    }
  });

  if (text) {
    if (text.startsWith(SYMBOL_CATEGORY)) {
      const [, idCategory] = text.match(regexCategory);

      bot.sendChatAction(chat.id, "typing");

      Product.findAndCountAll({
        where: { category_id: idCategory },
        order: ["id"],
        limit: LIMIT_PRODUCTS,
        offset: 0,
        include: [{ model: Resource, as: "resource" }]
      }).then(result => {
        if (result.count === 0) {
          bot.sendMessage(
            chat.id,
            "No hay productos registrados en esta categoria"
          );
          return;
        }

        const products = result.rows;

        let pages = Math.ceil(result.count / LIMIT_PRODUCTS);

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
                    text: "️⬅ Atras",
                    callback_data: `product@change_page:0`
                  },
                  {
                    text: "Siguiente ➡",
                    callback_data: `product@change_page:${pages > 1 ? 2 : 0}`
                  }
                ],
                [
                  {
                    text: "➕ Agregar al Carrito",
                    callback_data: `product@add_car:${product.id}`
                  }
                ]
              ]
            }
          });
        });

        session.update(sessionKey, {
          context: {
            category_id: idCategory
          }
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
        bot.sendMessage(chat.id, "Selecciona una opcion", {
          reply_markup: {
            keyboard: [[COMMAND_PRODUCTS, COMMAND_CAR], [COMMAND_BACK]]
          }
        });
        break;
      case COMMAND_PURCHASES:
        const dataMessage = [];
        User.findOne({ where: { chat_id: chat.id } }).then(user => {
          Purchase.findAll({
            where: { user_id: user.id },
            include: [{ model: User, as: "user" }]
          })
            .then(data => {
              if (data.length > 0) {
                data.forEach(item => {
                  dataMessage.push(
                    `` +
                      `<b>Nombre:</b> ${item.user.first_name} ${
                        item.user.last_name
                      }\n` +
                      `<b>Direccion:</b> ${item.address_shipping}\n` +
                      `<b>Total Facturado:</b> ${
                        item.total_amount
                      } ${SYMBOL_CURRENCY}\n`
                  );
                });
              }

              return dataMessage.join(
                "\n--------------------------------------\n"
              );
            })
            .then(msg => {
              bot.sendMessage(chat.id, msg, {
                parse_mode: "HTML",
                reply_markup: {
                  keyboard: [[COMMAND_BACK]]
                }
              });
            });
        });
        break;
      case COMMAND_CONFIRM_PURCHASE:
        User.findOne({ where: { chat_id: chat.id } }).then(user =>
          session
            .set(sessionKey, {
              action: ACTION_SET_ADDRESS_SHIPPING,
              context: { user_id: user.id }
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
        const dataCar = [];

        User.findOne({ where: { chat_id: chat.id } }).then(user => {
          ShoppingCar.findAll({
            where: { user_id: user.id },
            include: [{ model: Product, as: "product" }]
          })
            .then(data => {
              if (data.length > 0) {
                data.forEach(item => {
                  dataCar.push(
                    `` +
                      `<b>Nombre:</b> ${item.product.name}\n` +
                      `<b>Precio:</b> ${
                        item.product.price
                      } ${SYMBOL_CURRENCY}\n` +
                      `<b>Cantidad:</b> ${item.quantity}\n` +
                      `<b>Total:</b> ${item.product.price *
                        item.quantity} ${SYMBOL_CURRENCY}\n`
                  );
                });
              }

              return dataCar.join("\n--------------------------------------\n");
            })
            .then(msg => {
              bot.sendMessage(chat.id, msg, {
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
  const sessionKey = `${from.id}:${chat.id}`;

  User.findOrCreate({
    where: { chat_id },
    defaults: {
      chat_id,
      first_name,
      last_name,
      username
    }
  }).spread((user, created) => {
    session.set(sessionKey, {
      action: ACTION_NONE,
      context: { user_id: user.id }
    });

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
  const sessionKey = `${from.id}:${message.chat.id}`;

  if (namespace === "product" && action === "add_car") {
    const { chat } = message;
    User.findOne({ where: { chat_id: chat.id } })
      .then(user => {
        session.get(sessionKey).then(data => {
          const { context } = data;
          return session.update(sessionKey, {
            action: ACTION_SET_QUANTITY_PRODUCT,
            context: { ...context, product_id: params, user_id: user.id }
          });
        });
      })
      .then(() => {
        bot.sendMessage(chat.id, "Escriba la cantidad que desea comprar");
      });
  }

  if (namespace === "product" && action === "change_page") {
    session.get(sessionKey).then(data => {
      const { context } = data;
      const { category_id } = context;
      const page = parseInt(params);

      if (category_id && page > 0) {
        const { chat, message_id } = message;
        const offset = LIMIT_PRODUCTS * (page - 1);

        bot.sendChatAction(chat.id, "upload_photo");

        Product.findAndCountAll({
          where: { category_id },
          order: ["id"],
          limit: LIMIT_PRODUCTS,
          offset: offset,
          include: [{ model: Resource, as: "resource" }]
        }).then(result => {
          const products = result.rows;

          let pages = Math.ceil(result.count / LIMIT_PRODUCTS);

          products.forEach(product => {
            const media = {
              type: "photo",
              media: `attach://image`,
              caption: `
  📦 Producto: ${product.name}
  ℹ️ Descripcion: ${product.description}
  💰 Precio: ${product.price} ${SYMBOL_CURRENCY}`
            };

            const sendData = bot._formatSendData(
              "image",
              fs.createReadStream(product.resource.path)
            );

            bot._request("editMessageMedia", {
              qs: {
                media: JSON.stringify(media),
                chat_id: chat.id,
                message_id,
                image: sendData[1],
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [
                      {
                        text: "️⬅ Atras",
                        callback_data: `product@change_page:${page - 1}`
                      },
                      {
                        text: "Siguiente ➡",
                        callback_data: `product@change_page:${
                          page + 1 <= pages ? page + 1 : 0
                        }`
                      }
                    ],
                    [
                      {
                        text: "➕ Agregar al Carrito",
                        callback_data: `product@add_car:${product.id}`
                      }
                    ]
                  ]
                })
              },
              formData: sendData[0]
            });
          });
        });
      }
    });
  }
});

module.exports = bot;
