const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { signUp, signIn, logOut } = require("../controller/auth");

router.route("/signin").post(signIn);
router.route("/signup").post(signUp);
router.route("/logout").get(logOut);

module.exports = router;