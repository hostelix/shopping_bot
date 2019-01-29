const express = require("express");
const User = require("../database/models").User;

const router = express.Router();

router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] }
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
  User.findByPk(req.params.id, {
    attributes: { exclude: ["password"] }
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
  User.create(req.body)
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Usuario creado con exito"
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
  User.findByPk(req.params.id)
    .then(user => {
      return user.update(req.body);
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Usuario actualizado con exito"
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
  User.findByPk(req.params.id)
    .then(user => {
      return user.destroy();
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Usuario eliminado con exito"
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
