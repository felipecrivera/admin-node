const errorHandler = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const signin = async (req, res, next) => {
  try {
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
        res
          .cookie("access-token", token, { httpOnly: true })
          .status(200)
          .json({ customer: rest });
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
module.exports = { signin, signup };
