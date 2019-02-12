const express = require("express");
const { Category } = require("../../database/models");

const router = express.Router();

router.get("/", (req, res) => {
  Category.findAll()
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
  Category.findByPk(req.params.id)
    .then(category => {
      res.status(200).json(category);
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
  Category.create(req.body)
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "categoria registrada con exito"
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
  Category.findByPk(req.params.id)
    .then(category => {
      return category.update(req.body);
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "categoria actualizada con exito"
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
  Category.findByPk(req.params.id)
    .then(category => {
      return category.destroy();
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "category eliminado con exito"
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
