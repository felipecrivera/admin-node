const Record = require("../models/record.model.js");
const bcryptjs = require("bcryptjs");
const Customer = require("../models/customer.model.js");
const errorHandler = require("../utils/error.js");

const edit = async (req, res, next) => {
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
const create = async (req, res, next) => {
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

      rows.forEach(async (e) => {
        const { firstName, lastName, email } = e;
        const hashedPassword = await bcryptjs.hash('123456789', 10);
        await Customer.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });
      })

      return res.status(201).json(data);
    }
    return next(errorHandler(500, "Please provide validate data"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const get = async (req, res, next) => {
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

module.exports = { create, edit, get };
