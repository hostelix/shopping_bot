const express = require("express");
const { Purchase, User } = require("../../database/models");

const router = express.Router();

router.get("/", (req, res) => {
  Purchase.findAll({
    include: [{ model: User, as: "user" }]
  })
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
  Purchase.findByPk(req.params.id, {
    include: [{ model: User, as: "user" }]
  })
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
  Purchase.create(req.body)
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Compra registrada con exito"
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
  Purchase.findByPk(req.params.id)
    .then(purchase => {
      return purchase.update(req.body);
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Compra actualizada con exito"
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
  Purchase.findByPk(req.params.id)
    .then(purchase => {
      return purchase.destroy();
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Compra eliminado con exito"
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
