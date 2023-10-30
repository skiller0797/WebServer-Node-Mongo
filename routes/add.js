const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { addLaundary } = require("../controller/add");

router.route("/addlaundary").post(addLaundary);

module.exports = router;