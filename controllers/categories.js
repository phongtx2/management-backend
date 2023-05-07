const { User, Category, sequelize } = require("../models");

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
    res.status(500).json({ success: false, error });
  }
};

exports.createCategory = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
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
    res.status(500).json({ success: false, error: error.message });
  }
};
