const express = require("express");
const Sequelize = require("sequelize");
const { Product, Category } = require("../../database/models");

const router = express.Router();

router.get("/", (req, res) => {
  const { chart } = req.query;

  switch (chart) {
    case "category":
      //select count(*) as value, categories.name as name from products inner join categories on products.category_id = categories.id;
      Product.findAll({
        group: ["category_id"],
        include: [{ model: Category, as: "category" }],
        attributes: [
          "category_id",
          [Sequelize.fn("COUNT", "category_id"), "value"]
        ]
      }).then(data => res.json(data));
      break;
    default:
      res.json([]);
      break;
  }
});

module.exports = router;
