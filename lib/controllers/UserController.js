const express = require("express");
const User = require("../database/models").User;

const router = express.Router();

router.get("/", (req, res) => {
  User.findAll()
    .then(data => {
      res.json({
        status: 200,
        results: data
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

router.post("/", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

module.exports = router;
