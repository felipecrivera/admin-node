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
    const type = req.params.type;
    const customerId = req.params.id;
    const { filter: currentActiveFilter } = req.body;
    let records = [];
    var dayCnt = 1;
    var prevdayCnt = 1;
    var conversations = [];
    const td = new Date()
    var prevrecords = []
    var prevconversations = []
    var prevbookingRecords = []
    if (currentActiveFilter == 1) {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      
      records = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: startOfDay, $lte: endOfDay
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: startOfDay, $lte: endOfDay
        } : {$ne: null}
      }).exec();

      conversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: startOfDay, $lte: endOfDay
        },
      }).exec();

      const prevDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0);
      const prevstartOfDay = new Date(prevDay.getFullYear(), prevDay.getMonth(), prevDay.getDate(), 0, 0, 0);
      const prevendOfDay = new Date(prevDay.getFullYear(), prevDay.getMonth(), prevDay.getDate(), 23, 59, 59, 999);
      
      prevrecords = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: prevstartOfDay, $lte: prevendOfDay
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: prevstartOfDay, $lte: prevendOfDay
        } : {$ne: null}
      }).exec();

      prevconversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: prevstartOfDay, $lte: prevendOfDay
        },
      }).exec();

    } else if (currentActiveFilter == 2) {
      dayCnt = td.getDay() + 1
      prevdayCnt = 7;
      const start = startOfWeek(new Date(), { weekStartsOn: 1 });
      const end = endOfWeek(new Date(), { weekStartsOn: 1 });

      const startWeek = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      const endWeek = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);

      records = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: startWeek, $lte: endWeek
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: startWeek, $lte: endWeek
        } : {$ne: null}
      }).exec();
      conversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: startWeek, $lte: endWeek
        },
      }).exec();


      dayCnt = td.getDay() + 1
      const weekBefore = new Date(start.getFullYear(), start.getMonth(), start.getDate() - 7);
      const prevstart = startOfWeek(weekBefore, { weekStartsOn: 1 });
      const prevend = endOfWeek(weekBefore, { weekStartsOn: 1 });

      const prevstartWeek = new Date(prevstart.getFullYear(), prevstart.getMonth(), prevstart.getDate(), 0, 0, 0);
      const prevendWeek = new Date(prevend.getFullYear(), prevend.getMonth(), prevend.getDate(), 23, 59, 59, 999);

      prevrecords = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: prevstartWeek, $lte: prevendWeek
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: prevstartWeek, $lte: prevendWeek
        } : {$ne: null}
      }).exec();
      prevconversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: prevstartWeek, $lte: prevendWeek
        },
      }).exec();
    } else if (currentActiveFilter == 3) {
      dayCnt = td.getDate()
      const start = startOfMonth(new Date(), { weekStartsOn: 1 });
      const end = endOfMonth(new Date(), { weekStartsOn: 1 });

      const startMonth = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);

      records = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: startMonth, $lte: endMonth
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: startMonth, $lte: endMonth
        } : {$ne: null}
      }).exec();
      conversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: startMonth, $lte: endMonth
        },
      }).exec();

      const beforeDay = new Date(td.getFullYear(), td.getMonth()-1, td.getDate(), 0, 0, 0);
      const prevstart = startOfMonth(beforeDay, { weekStartsOn: 1 });
      const prevend = endOfMonth(beforeDay, { weekStartsOn: 1 });

      const prevstartMonth = new Date(prevstart.getFullYear(), prevstart.getMonth(), prevstart.getDate(), 0, 0, 0);
      const prevendMonth = new Date(prevend.getFullYear(), prevend.getMonth(), prevend.getDate(), 23, 59, 59, 999);

      prevrecords = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: prevstartMonth, $lte: prevendMonth
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: prevstartMonth, $lte: prevendMonth
        } : {$ne: null}
      }).exec();
      prevconversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: prevstartMonth, $lte: prevendMonth
        },
      }).exec();
      prevdayCnt = prevend.getDate()
    } else if (currentActiveFilter == 4) {
      const td = new Date()
      const start = startOfQuarter(new Date(), { weekStartsOn: 1 });
      const end = endOfQuarter(new Date(), { weekStartsOn: 1 });
      const prevMonth = new Date(start.getFullYear(), start.getMonth()-1, start.getDate());
      const dprevMonth = new Date(start.getFullYear(), start.getMonth()-2, start.getDate());
      dayCnt = td.getDate() + endOfMonth(prevMonth).getDate() + endOfMonth(dprevMonth).getDate();

      const startQuarter = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      const endQuarter = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);

      records = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: startQuarter, $lte: endQuarter
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: startQuarter, $lte: endQuarter
        } : {$ne: null}
      }).exec();
      conversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: startQuarter, $lte: endQuarter
        },
      }).exec();

      const beforeDay = new Date(start.getFullYear(), start.getMonth()-3, start.getDate());
      const prevstart = startOfQuarter(beforeDay, { weekStartsOn: 1 });
      const prevend = endOfQuarter(beforeDay, { weekStartsOn: 1 });
      const pprevMonth = new Date(prevstart.getFullYear(), prevstart.getMonth()+1, prevstart.getDate());
      const pdprevMonth = new Date(prevstart.getFullYear(), prevstart.getMonth()+2, prevstart.getDate());
      prevdayCnt = endOfMonth(beforeDay).getDate() + endOfMonth(pprevMonth).getDate() + endOfMonth(pdprevMonth).getDate();

      const prevstartQuarter = new Date(prevstart.getFullYear(), prevstart.getMonth(), prevstart.getDate(), 0, 0, 0);
      const prevendQuarter = new Date(prevend.getFullYear(), prevend.getMonth(), prevend.getDate(), 23, 59, 59, 999);

      prevrecords = await Record.find({
        customer: customerId,
        activationDate: type == "Activation" ? {
          $gte: prevstartQuarter, $lte: prevendQuarter
        } : {$ne: null},
        bookingDate: type == 'Booking' ? {
          $gte: prevstartQuarter, $lte: prevendQuarter
        } : {$ne: null}
      }).exec();
      prevconversations = await Conversation.find({
        customer: customerId,
        date: {
          $gte: prevstartQuarter, $lte: prevendQuarter
        },
      }).exec();
    }
    const bookingRecords = records.filter(
      (item) => item.outCome == "Booked Appt"
    );

    res.status(201).json({
      records,
      noOfConversations: conversations.reduce((a, c) => a + c['count'], 0),
      noOfBookings: bookingRecords.length,
      noOfActivations: records.length - bookingRecords.length,
      dayCnt,
      prevrecords,
      prevnoOfConversations: prevconversations.reduce((a, c) => a + c['count'], 0),
      prevnoOfBookings: prevbookingRecords.length,
      prevnoOfActivations: prevrecords.length - prevbookingRecords.length,
      prevdayCnt,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
