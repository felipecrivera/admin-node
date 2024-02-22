import errorHandler from "../utils/error.js";
import Conversation from "../models/conversation.model.js";
import Customer from "../models/customer.model.js";

export const create = async (req, res, next) => {
  try {
    const conversations = req.body;
    if (conversations) {
      const promises = conversations.map((item) => {
        return new Promise((res, rej) => {
          const { date, count, AccountId } = item;

          const dt = new Date()

          Customer.find({ AccountId: AccountId })
            .then((parent) => {
              let parentId = "";
              if (parent) {
                parentId = parent[0]._id;
              }
              return Conversation.create({
                date: dt,
                count,
                customer: parentId,
              });
            })
            .then((result) => {
              res();
            })
            .catch((error) => {
              rej();
            });
        });
      });

      await Promise.allSettled(promises);
      return res
        .status(201)
        .json({ message: "Conversation created succesfully" });
    }
    return next(errorHandler(500, "Please provide validate data"));
  } catch (error) {
    next(error);
  }
};
