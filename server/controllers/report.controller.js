const errorHandler = require("../utils/error.js");

const edit = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const create = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = { create, edit };
