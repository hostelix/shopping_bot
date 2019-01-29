const express = require("express");
const Product = require("../database/models").Product;

const router = express.Router();

router.get("/", (req, res) => {
  Product.findAll()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(500).json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

router.get("/:id", (req, res) => {
  Product.findByPk(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

router.post("/", (req, res) => {
  Product.create(req.body)
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Producto registrado con exito"
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});
router.put("/:id", (req, res) => {
  Product.findByPk(req.params.id)
    .then(product => {
      return product.update(req.body);
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Producto actualizado con exito"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

router.delete("/:id", (req, res) => {
  Product.findByPk(req.params.id)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Producto eliminado con exito"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

module.exports = router;
