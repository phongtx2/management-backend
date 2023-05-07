const express = require("express");
const {
  addNewBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/books");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(getBooks).post(authenticate, addNewBook);
router
  .route("/:id")
  .get(getBookById)
  .patch(authenticate, updateBook)
  .delete(authenticate, deleteBook);

module.exports = router;
