const express = require("express");
const {
  addNewProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(getProducts).post(authenticate, addNewProduct);
router
  .route("/:id")
  .get(getProductById)
  .patch(authenticate, updateProduct)
  .delete(authenticate, deleteProduct);

module.exports = router;
