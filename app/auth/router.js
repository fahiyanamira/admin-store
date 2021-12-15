var express = require("express");
var router = express.Router();
const { signup, signin } = require("./controller");
// const multer = require("multer");
const upload = require("../../utils/multer");
// const os = require("os");

router.post("/signup", upload.single("image"), signup);
router.post("/signin", signin);

module.exports = router;
