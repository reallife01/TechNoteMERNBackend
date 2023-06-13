const express = require("express");
const loginLimiter = require("../middleware/logLimiter");
const authController = require("../controllers/authController");
const router = express.Router();


router.route("/").post(loginLimiter, authController.login);

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

module.exports = router;