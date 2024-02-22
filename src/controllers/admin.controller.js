import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Admin from "../models/admin.model.js";
import Record from "../models/record.model.js";
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
    const dbAdmin = await Admin.findOne({ email });
    if (dbAdmin) {
      const admin = await bcryptjs.compare(password, dbAdmin.password);
      if (admin) {
        if (email.endsWith("prospectiq.ai")) {
          const token = jwt.sign(
            { id: dbAdmin._id },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "365d",
            }
          );

          const { password: pass, ...rest } = dbAdmin._doc;
          res.status(200).json({ admin: rest, token });
        } else {
          return next(errorHandler(401, "Not Admin Account"));
        }
      } else {
        return next(errorHandler(401, "Wrong credentials"));
      }
    } else {
      return next(errorHandler(404, "Admin not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const userSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const dbAdmin = await Admin.findOne({ email });
    if (dbAdmin) {
      const admin = await bcryptjs.compare(password, dbAdmin.password);
      if (admin) {
        const token = jwt.sign(
          { id: dbAdmin._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "365d",
          }
        );

        const { password: pass, ...rest } = dbAdmin._doc;
        res.status(200).json({ admin: rest, token });
      } else {
        return next(errorHandler(401, "Wrong credentials"));
      }
    } else {
      return next(errorHandler(404, "Admin not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  const id = req.params.id;
  try {
    const record = await Admin.findById(id);
    if (record) {
      const updatedRecord = await Admin.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updatedRecord);
    } else {
      return next(errorHandler(404, "Admin not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (email.endsWith("prospectiq.ai")) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      await Admin.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "Admin created succesfully" });
    } else {
      return next(errorHandler(401, "Not Admin Email"));
    }
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.status(201).json(admins);
  } catch (error) {
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.status(201).json(admins);
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
        // bookingDate: {
        //   $lte: new Date().toISOString(),
        // },
      }).exec();

      conversations = await Conversation.find({
        customer: customerId,
        // date: {
        //   $lte: new Date().toISOString(),
        //   $gte: new Date().toISOString(),
        // },
      }).exec();

      console.log(records, '+++++')
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
      console.log(conversations, '+++')
    res.status(201).json({
      records,
      noOfConversations: conversations.reduce((a, c) => a + c['count'], 0),
      noOfBookings: bookingRecords.length,
      noOfActivations: records.length - bookingRecords.length,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
