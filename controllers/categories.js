const { User, Category, sequelize } = require("../models");
const httpStatus = require("http-status");

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

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};

exports.createCategory = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { name, image } = req.body;
    const category = await Category.create({ name, image });
    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.log(error.message);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      throw new Error("Category not found");
    }
    await category.destroy();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    let { page = 1, limit = 9 } = req.query;
    limit = parseInt(limit, 10);
    const startIndex = (page - 1) * limit;

    const { rows, count } = await Category.findAndCountAll({
      offset: startIndex,
      limit,
      // order: [["id", "DESC"]],
    });

    return res.status(httpStatus.OK).json({
      success: true,
      categories: rows,
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

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      where: { id },
    });
    return res.status(httpStatus.OK).json({ success: true, category });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const { name, image } = req.body;
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      throw new Error("Category not found");
    }
    await category.update({
      name,
      image,
    });
    return res.status(httpStatus.OK).json({ success: true, category });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};
