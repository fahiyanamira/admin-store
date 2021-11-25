var express = require("express");
var router = express.Router();
const { index } = require("./controller");

// import middleware:
const { isLoginAdmin } = require("../middleware/auth");

/* GET home page. */
//sebelum masuk ke dashboard harus lewatin Login:
router.use(isLoginAdmin);
router.get("/", index);

module.exports = router;
