import Record from "../models/record.model.js";
import bcryptjs from "bcryptjs";
import Customer from "../models/customer.model.js";
import errorHandler from "../utils/error.js";
import Campaign from "../models/campaign.model.js";

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
export const createOne = async (req, res, next) => {
  try {
    const data = await Record.create(req.body);
    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const create = async (req, res, next) => {
  try {
    let rows = req.body;
    if (rows) {
      rows.forEach(async (item) => {
        let obj = {};
        let keys = Object.keys(item);

        keys.forEach((key) => {
          obj[key.trim()] = item[key];
        });

        let {
          AccountName,
          AccountId,
          email,
          outCome,
          campaign: campaignName,
        } = obj;

        if (AccountId) {
          let {
            activationDate,
            firstName,
            lastName,
            title,
            email,
            phone,
            company,
            address,
            city,
            state,
            zipCode,
            outCome,
            bookingDate,
            bookingTime,
            notes,
          } = obj;
          var customer = await Customer.findOne({ AccountId: AccountId });
          let campaign = await Campaign.findOne({ name: campaignName });

          if (!customer) {
            customer = await Customer.create({
              AccountName,
              AccountId,
              email,
            });
          }

          if (!campaign) {
            let type = (outCome == "Booked Appt") ? "Boost" : "Activate"

            campaign = await Campaign.create({
              type: type,
              name: campaignName,
              customer: customer._id,
            });
          }


          const data = await Record.create({
            activationDate,
            customer: customer._id,
            campaign: campaign._id,
            firstName,
            lastName,
            title,
            email,
            phone,
            company,
            address,
            city,
            state,
            zipCode,
            outCome,
            bookingDate,
            bookingTime,
            notes,
          });
        }
      });
      return res.status(201).json({ message: "Records created succesfully" });
    }
    return next(errorHandler(500, "Please provide validate data"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const records = await Record.find({})
      .populate("customer")
      .populate("campaign")
      .exec();
    if (records) {
      return res.status(200).json(records);
    } else {
      return next(errorHandler(404, "records not found"));
    }
  } catch (error) {
    next(error);
  }
};
