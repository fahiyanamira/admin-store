var express = require("express");
var router = express.Router();
const { landingPage, detailPage, category, checkout, history, historyDetail, dashboard, profile, editProfile } = require("./controller");
//import multer:
// const multer = require("multer");
// import os:
// const os = require("os");
//import middleware:
const { isLoginPlayer } = require("../middleware/auth");

const upload = require("../../utils/multer");

router.get("/landingpage", landingPage);
router.get("/:id/detail", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, history);
router.get("/history/:id/detail", isLoginPlayer, historyDetail);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, profile);
router.put("/profile/:id", isLoginPlayer, upload.single("image"), editProfile);

module.exports = router;
