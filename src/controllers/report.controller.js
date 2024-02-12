const errorHandler = require("../utils/error.js");
const Record = require("../models/record.model.js");

const search = async (req, res, next) => {
  try {
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const searchTerm = req.query.searchTerm || "";
    let filters = {};

    if (searchTerm) {
      filters["$or"] = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { campaign: { $regex: searchTerm, $options: "i" } },
      ];
    }
    if (startDate && endDate) {
      filters["bookingDate"] = {
        $gte: ISODate(startDate),
        $lt: ISODate(endDate),
      };
    } else {
      if (startDate) {
        filters["bookingDate"] = {
          $gte: ISODate(startDate),
        };
      }

      if (endDate) {
        filters["bookingDate"] = {
          $lt: ISODate(endDate),
        };
      }
    }
    console.log(filters);
    const records = await Record.find(filters, {
      createdAt: 0,
      updatedAt: 0,
    }).select("-__v");

    return res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

module.exports = { search };
