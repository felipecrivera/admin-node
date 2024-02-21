import errorHandler from "../utils/error.js";
import Record from "../models/record.model.js";

export const search = async (req, res, next) => {
  try {
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const searchTerm = req.query.searchTerm || "";
    if (startDate == "" && endDate == "" && searchTerm == "") {
      const records = await Record.find({})
        .populate("customer")
        .populate("campaign")
        .exec();
      return res.status(200).json(records);
    } else {
      const records = await Record.find(
        {
          $or: [
            { firstName: { $regex: searchTerm, $options: "i" } },
            { lastName: { $regex: searchTerm, $options: "i" } },
            { campaign: { $regex: searchTerm, $options: "i" } },
            { title: { $regex: searchTerm, $options: "i" } },
          ],
        },
        {
          createdAt: 0,
          updatedAt: 0,
        }
      )
        .populate("campaign")
        .select("-__v");
      console.log(records);
      return res.status(200).json(records);
    }
  } catch (error) {
    next(error);
  }
};
