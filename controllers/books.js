const httpStatus = require("http-status");
const { Book, User, Category } = require("../models");
const { Op, and, or, where } = require("sequelize");

const verifyAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    if (user.role !== "admin") {
      throw new Error("You are not admin");
    }
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.addNewBook = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { name, categoryId, image, downloadUrl, description } = req.body;
    const book = await Book.create({
      name,
      categoryId,
      image,
      downloadUrl,
      description,
    });
    return res.status(httpStatus.CREATED).json({ success: true, book });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    let findingQuery = {};
    if (req.query.categoryId) {
      findingQuery = { ...findingQuery, categoryId: req.query.categoryId };
    }

    //filter keyword
    if (req.query.keyword) {
      findingQuery = {
        ...findingQuery,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${req.query.keyword}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${req.query.keyword}%`,
            },
          },
        ],
      };
    }

    //Pagination, default page 1, limit 5
    let { page = 1, limit = 9 } = req.query;
    limit = parseInt(limit, 10);
    const startIndex = (page - 1) * limit;

    const { rows, count } = await Book.findAndCountAll({
      where: findingQuery,
      offset: startIndex,
      limit,
      order: [["createdAt", "DESC"]],
      include: [{ model: Category }],
    });

    return res.status(httpStatus.OK).json({
      success: true,
      books: rows,
      total: count,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOne({
      where: { id },
      include: [{ model: Category }],
    });
    return res.status(httpStatus.OK).json({ success: true, book });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const { name, categoryId, image, downloadUrl, description } = req.body;
    const book = await Book.findOne({ where: { id } });
    if (!book) {
      throw new Error("Book not found");
    }
    await book.update({
      name,
      categoryId,
      image,
      downloadUrl,
      description,
    });
    return res.status(httpStatus.OK).json({ success: true, book });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const book = await Book.findOne({ where: { id } });
    if (!book) {
      throw new Error("Book not found");
    }
    await book.destroy();
    return res.status(httpStatus.OK).json({ success: true });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};
