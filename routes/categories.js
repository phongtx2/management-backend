const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
  getCategoryById,
  updateCategory,
} = require("../controllers/categories");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(getCategories).post(authenticate, createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .delete(authenticate, deleteCategory)
  .patch(authenticate, updateCategory);

module.exports = router;
