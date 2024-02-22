import errorHandler from "../utils/error.js";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";

export const create = async (req, res, next) => {
  try {
    const parent = await Customer.findById(req.body.customer);

    const { firstName, lastName, email, title, phoneNumber, customer } =
      req.body;
    const result = await User.create({
      firstName,
      lastName,
      email,
      title,
      phoneNumber,
      customer,
    });
    if (parent && parent.users.length > 0) {
      await Customer.findByIdAndUpdate(req.body.customer, {
        users: [...parent.users, result],
      });
    } else {
      await Customer.findByIdAndUpdate(req.body.customer, {
        users: [result],
      });
    }
    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  const id = req.params.id;
  try {
    const record = await User.findById(id);
    if (record) {
      const updatedRecord = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updatedRecord);
    } else {
      return next(errorHandler(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const id = req.params.id;

  try {
    const users = await User.find({ customer: id });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
