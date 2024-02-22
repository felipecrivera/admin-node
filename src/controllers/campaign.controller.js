import errorHandler from "../utils/error.js";
import Campaign from "../models/campaign.model.js";
import Customer from "../models/customer.model.js";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";
export const create = async (req, res, next) => {
  try {
    const parent = await Customer.findById(req.body.customer);

    const { type, campaignName, description, customer } = req.body;
    const result = await Campaign.create({
      type,
      name: campaignName,
      description,
      customer,
    });
    if (parent && parent.campaigns.length > 0) {
      await Customer.findByIdAndUpdate(req.body.customer, {
        campaigns: [...parent.campaigns, result],
      });
    } else {
      await Customer.findByIdAndUpdate(req.body.customer, {
        campaigns: [result],
      });
    }
    res.status(201).json({ message: "Campaign created succesfully" });
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  const id = req.params.id;
  try {
    const record = await Campaign.findById(id);
    if (record) {
      const updatedRecord = await Campaign.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updatedRecord);
    } else {
      return next(errorHandler(404, "Campaign not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const getAllCampaign = async (req, res, next) => {
  const id = req.params.id;

  try {
    const campaigns = await Campaign.find({ customer: id });
    res.status(200).json(campaigns);
  } catch (error) {
    next(error);
  }
};
