var express = require("express");
var router = express.Router();
const { index, viewCreate, viewEdit, actionCreate, actionEdit, actionDelete, actionStatus } = require("./controller");
//import multer:
const multer = require("multer");
// import os:
const os = require("os");

router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", multer({ dest: os.tmpdir() }).single("image"), actionCreate);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", multer({ dest: os.tmpdir() }).single("image"), actionEdit);
router.delete("/delete/:id", actionDelete);
router.put("/status/:id", actionStatus);

module.exports = router;
