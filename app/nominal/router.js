var express = require("express");
var router = express.Router();
const { index, viewCreate, actionCreateNominal, viewEdit, actionEdit, actionDelete } = require("./controller");

router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", actionCreateNominal);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", actionEdit);
router.delete("/delete/:id", actionDelete);

module.exports = router;
