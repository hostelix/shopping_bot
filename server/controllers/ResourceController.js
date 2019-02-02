const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const config = require("../config");

const uploadManager = multer({ dest: config.PATH_UPLOADS });

const Resource = require("../database/models").Resource;

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req);
});

router.post("/", uploadManager.single("file"), (req, res) => {
  Resource.create(req.file)
    .then(() => {
      res
        .status(200)
        .type("text")
        .send(req.file.filename);
    })
    .catch(() => {
      res
        .status(500)
        .type("text")
        .send("");
    });
});

router.delete("/:id", (req, res) => {
  Resource.findOne({
    where: { filename: req.params.id }
  })
    .then(resource => {
      fs.unlink(resource.path, err => {
        if (err) throw err;
      });
      resource.destroy();
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "resource eliminado con exito"
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
