const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/categories");
const { authenticate } = require("../middleware/auth");
const router = express.Router();
router.route("/").get(getCategories).post(authenticate, createCategory);
router.route("/:id").delete(authenticate, deleteCategory);

module.exports = router;
