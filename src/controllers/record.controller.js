import Record from "../models/record.model.js";
import bcryptjs from "bcryptjs";
import Customer from "../models/customer.model.js";
import errorHandler from "../utils/error.js";

export const edit = async (req, res, next) => {
  const id = req.params.id;
  try {
    const record = await Record.findById(id);
    if (record) {
      const updatedRecord = await Record.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updatedRecord);
    } else {
      return next(errorHandler(404, "Record not found"));
    }
  } catch (error) {
    next(error);
  }
};
export const create = async (req, res, next) => {
  try {
    let rows = req.body;
    if (rows) {
      let records = rows.map((item) => {
        let obj = {};
        let keys = Object.keys(item);

        keys.forEach((key) => {
          obj[key.trim()] = item[key];
        });
        return obj;
      });

      const data = await Record.insertMany(records);

      return res.status(201).json(data);
    }
    return next(errorHandler(500, "Please provide validate data"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const records = await Record.find({});
    if (records) {
      return res.status(200).json(records);
    } else {
      return next(errorHandler(404, "records not found"));
    }
  } catch (error) {
    next(error);
  }
};
