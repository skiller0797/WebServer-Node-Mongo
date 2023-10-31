const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { addLaundary, getSalesData } = require("../controller/add");

router.route("/addlaundary").post(addLaundary);
router.route("/getsalesdata").get(getSalesData);

module.exports = router;