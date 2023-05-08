const express = require("express");
const { getCategory } = require("../controllers/categories");
const router = express.Router();

router.route("/").get(getCategory);

module.exports = router;
