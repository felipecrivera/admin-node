const errorHandler = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const Admin = require("../models/admin.model.js");
const Record = require("../models/record.model.js");

const signin = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const dbAdmin = await Admin.findOne({ email });
    if (dbAdmin) {
      const admin = await bcryptjs.compare(password, dbAdmin.password);
      if (admin) {
        if (email.endsWith('prospectiq.ai')) {
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

const userSignin = async (req, res, next) => {
  try {
    console.log(req.body);
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

const edit = async (req, res, next) => {
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

const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Admin created succesfully" });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.status(201).json(admins);
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.status(201).json(admins);
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const admin = await Admin.findById(userId, { password: 0 });
    const adminEmail = admin.email
    const records = await Record.find({ email: adminEmail });
    res.status(201).json(records);
  } catch (error) {
    next(error);
  }
};
module.exports = { signin, signup, get, edit, getDashboard, me, userSignin };
