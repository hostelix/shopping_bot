const express = require("express");
const User = require("../database/models").User;

const router = express.Router();

router.get("/", (req, res) => {
  User.findAll()
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user.dataValues());
    })
    .catch(err => {
      res.json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

router.post("/", (req, res) => {
  User.create(req.body)
    .then(() => {
      res.json({
        status: 200,
        message: "Usuario creado con exito"
      });
    })
    .catch(() => {
      res.json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});
router.put("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      return user.update(req.body);
    })
    .then(() => {
      res.json({
        status: 200,
        message: "Usuario actualizado con exito"
      });
    })
    .catch(err => {
      res.json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      return user.destroy();
    })
    .then(() => {
      res.json({
        status: 200,
        message: "Usuario eliminado con exito"
      });
    })
    .catch(err => {
      res.json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

module.exports = router;
