const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req);
});

router.post("/", (req, res) => {
  console.log(req.files);
});

router.delete("/:id", (req, res) => {
  console.log(req);
});

module.exports = router;
