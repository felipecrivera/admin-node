import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Customer from "../models/customer.model.js";
import Record from "../models/record.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const dbCustomer = await Customer.findOne({ email });
    const dbUser = await User.findOne({ email }).populate("customer");
    console.log(dbUser);

    if (dbCustomer) {
      const customer = await bcryptjs.compare(password, dbCustomer.password);
      if (customer) {
        const token = jwt.sign(
          { id: dbCustomer._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "365d",
          }
        );

        const { password: pass, ...rest } = dbCustomer._doc;
        res.status(200).json({ customer: rest, token });
      } else {
        return next(errorHandler(401, "Wrong credentials"));
      }
    } else if (dbUser) {
      const user = await bcryptjs.compare(password, dbUser.password);
      if (user) {
        const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "365d",
        });

        const { password: pass, ...rest } = dbUser._doc;
        const { password: cusPass, ...customer } = dbUser._doc.customer._doc;
        res.status(200).json({ user: rest, customer, token });
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

export const edit = async (req, res, next) => {
  const id = req.params.id;
  try {
    const record = await Customer.findById(id);
    if (record) {
      const updatedRecord = await Customer.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updatedRecord);
    } else {
      return next(errorHandler(404, "Customer not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { AccountName, AccountId, email, password } = req.body;
    
    if (password)
      password = await bcryptjs.hash(password, 10);
    await Customer.create({
      AccountName,
      AccountId,
      email,
      password: password,
    });
    res.status(201).json({ message: "Customer created succesfully" });
  } catch (error) {
    next(error);
  }
};


export const signupUser = async (req, res, next) => {
  try {
    const { AccountName, AccountId, email, userId, password } = req.body;
    if (!email || !password) {
      next("Please provide valid data");
      return;
    }
    const customer = await Customer.find({ AccountId: AccountId });
    const customerValue = customer[0];
    const hashedPassword = await bcryptjs.hash(password, 10);
    await User.create({
      AccountName,
      AccountId,
      email,
      userId,
      password: hashedPassword,
      customer: customerValue?._id,
    });
    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const customers = await Customer.find({}, { password: 0 });
    res.status(201).json(customers);
  } catch (error) {
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const customers = await Customer.find({}, { password: 0 });
    res.status(201).json(customers);
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const { filter: currentActiveFilter } = req.body;
    let records = [],
      conversations = [];

    if (currentActiveFilter == 1) {
      records = await Record.find({
        customer: customerId,
        bookingDate: {
          $lte: new Date().toISOString(),
        },
      }).exec();

      conversations = await Conversation.find({
        customer: customerId,
        date: {
          $lte: new Date().toISOString(),
          $gte: new Date().toISOString(),
        },
      }).exec();
    } else if (currentActiveFilter == 2) {
      const start = startOfWeek(new Date(), { weekStartsOn: 1 });
      const end = endOfWeek(new Date(), { weekStartsOn: 1 });
      records = await Record.find({
        bookingDate: { $gte: start, $lte: end },
        customer: customerId,
      });
      conversations = await Conversation.find({
        date: { $gte: start, $lte: end },
        customer: customerId,
      });
    } else if (currentActiveFilter == 3) {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      records = await Record.find({
        bookingDate: { $gte: start, $lte: end },
        customer: customerId,
      });
      conversations = await Conversation.find({
        date: { $gte: start, $lte: end },
        customer: customerId,
      });
    } else if (currentActiveFilter == 4) {
      const start = startOfQuarter(new Date());
      const end = endOfQuarter(new Date());
      records = await Record.find({
        bookingDate: { $gte: start, $lte: end },
        customer: customerId,
      });
      conversations = await Conversation.find({
        date: { $gte: start, $lte: end },
        customer: customerId,
      });
    }
    const bookingRecords = records.filter(
      (item) => item.outCome == "Booked Appt"
    );

    res.status(201).json({
      records,
      noOfConversations: conversations.length,
      noOfBookings: bookingRecords.length,
      noOfActivations: records.length - bookingRecords.length,
    });
  } catch (error) {
    next(error);
  }
};
