import errorHandler from "../utils/error.js";
import Record from "../models/record.model.js";

export const search = async (req, res, next) => {
  try {
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const searchTerm = req.query.searchTerm || "";
    const campaign = req.query.campaign || "";
    console.log(campaign)
    if (startDate == "" && endDate == "" && searchTerm == "" && campaign == "") {
      const records = await Record.find({})
        .populate("customer")
        .populate("campaign")
        .exec();
      return res.status(200).json(records);
    } else {
      let records = await Record.aggregate([
        {
          $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer',
          }
        },
        {
          $lookup: {
            from: 'campaigns',
            localField: 'campaign',
            foreignField: '_id',
            as: 'campaign',
          }
        },
        {
          $match: {
            $or: [
              { 'customer.AccountId': { $regex: searchTerm, $options: "i" } },
              { 'customer.AccountName': { $regex: searchTerm, $options: "i" } },
              { firstName: { $regex: searchTerm, $options: "i" } },
              { lastName: { $regex: searchTerm, $options: "i" } },
              { title: { $regex: searchTerm, $options: "i" } },
            ],
          },
        },
      ]);
      
      records=records.map((e) => {
        e.campaign = e.campaign[0]
        e.customer = e.customer[0]
        return e
      })
      // .populate("campaign")
      //   .select("-__v");
      return res.status(200).json(records);
    }
  } catch (error) {
    next(error);
  }
};
