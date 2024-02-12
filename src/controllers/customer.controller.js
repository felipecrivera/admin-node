const errorHandler = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const Customer = require("../models/customer.model.js");

const signin = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const dbCustomer = await Customer.findOne({ email });
    if (dbCustomer) {
      const customer = await bcryptjs.compare(password, dbCustomer.password);
      if (customer) {
        const token = jwt.sign(
          { id: dbCustomer._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1hr",
          }
        );

        const { password: pass, ...rest } = dbCustomer._doc;
        res.status(200).json({ customer: rest, token });
      } else {
        return next(errorHandler(401, "Wrong credentials"));
      }
    } else {
      return next(errorHandler(404, "Customer not found"));
    }
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    await Customer.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Customer created succesfully" });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const customers = await Customer.find({}, { password: 0 });
    res.status(201).json(customers);
  } catch (error) {
    next(error);
  }
};
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const customer = await Customer.findById(userId, { password: 0 });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};
module.exports = { signin, signup, get, getDashboard };