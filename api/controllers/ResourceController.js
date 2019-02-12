const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const config = require("../../config/config");
const { Resource } = require("../../database/models");

const uploadManager = multer({ dest: config.PATH_UPLOADS });
const router = express.Router();

router.get("/:id", (req, res) => {
  Resource.findByPk(req.params.id)
    .then(resource => {
      res.status(200).sendFile(path.join(__dirname, "../../", resource.path), {
        headers: {
          "Content-Type": resource.mimetype,
          "Content-disposition": `filename="${resource.originalname}"`
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: "",
        error: "internal_error",
        status: 500
      });
    });
});

router.post("/", uploadManager.single("file"), (req, res) => {
  Resource.create(req.file)
    .then(resource => {
      res
        .status(200)
        .type("text")
        .send(`${resource.id}`);
    })
    .catch(err => {
      res
        .status(500)
        .type("text")
        .send("");
    });
});

router.delete("/:id", (req, res) => {
  Resource.findByPk(req.params.id)
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
