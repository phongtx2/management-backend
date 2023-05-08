const httpStatus = require("http-status");
const { Product, User, Category } = require("../models");
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

exports.addNewProduct = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { name, categoryId, image, downloadUrl, description } = req.body;
    const product = await Product.create({
      name,
      categoryId,
      image,
      downloadUrl,
      description,
    });
    return res.status(httpStatus.CREATED).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let findingQuery = {};
    if (req.query.categoryId == 0) {
      findingQuery = findingQuery;
    } else if (req.query.categoryId) {
      findingQuery = { ...findingQuery, categoryId: req.query.categoryId };
    }

    //filter keyword
    // if (req.query.keyword) {
    //   findingQuery = {
    //     ...findingQuery,
    //     [Op.or]: [
    //       {
    //         name: {
    //           [Op.like]: `%${req.query.keyword}%`,
    //         },
    //       },
    //       {
    //         description: {
    //           [Op.like]: `%${req.query.keyword}%`,
    //         },
    //       },
    //     ],
    //   };
    // }

    //Pagination, default page 1, limit 5
    let { page = 1, limit = 9 } = req.query;
    limit = parseInt(limit, 10);
    const startIndex = (page - 1) * limit;

    const { rows, count } = await Product.findAndCountAll({
      where: findingQuery,
      offset: startIndex,
      limit,
      order: [["createdAt", "DESC"]],
      include: [{ model: Category }],
    });

    return res.status(httpStatus.OK).json({
      success: true,
      products: rows,
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

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
      include: [{ model: Category }],
    });
    return res.status(httpStatus.OK).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const { name, categoryId, image, downloadUrl, description } = req.body;
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    await product.update({
      name,
      categoryId,
      image,
      downloadUrl,
      description,
    });
    return res.status(httpStatus.OK).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    await product.destroy();
    return res.status(httpStatus.OK).json({ success: true });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};
