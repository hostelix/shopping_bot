const express = require("express");
const Sale = require("../database/models").Sale;

const router = express.Router();

router.get("/", (req, res) => {
  Sale.findAll()
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
  Sale.findByPk(req.params.id)
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
  Sale.create(req.body)
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Venta registrada con exito"
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
  Sale.findByPk(req.params.id)
    .then(sale => {
      return sale.update(req.body);
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Venta actualizada con exito"
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
  Sale.findByPk(req.params.id)
    .then(sale => {
      return sale.destroy();
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Venta eliminado con exito"
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
