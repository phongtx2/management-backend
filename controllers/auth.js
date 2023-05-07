const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { User, CodeVerify, sequelize } = require("../models");

const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = getSignedJwtToken(user.id);
    const options = {
      httpOnly: true,
    };
    return res.status(httpStatus.CREATED).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Dont't have an account",
      });
    }
    if (password !== user.password) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = getSignedJwtToken(user.id);
    const options = {
      httpOnly: true,
    };
    return res.status(httpStatus.OK).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};
