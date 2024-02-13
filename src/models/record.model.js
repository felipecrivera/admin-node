const mongoose = require("mongoose");

const recordSchema = mongoose.Schema(
  {
    activationDate: {
      type: String,
    },
    campaign: {
      type: String,
    },
    company: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    title: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    outCome: {
      type: String,
    },
    bookingDate: {
      type: String,
    },
    bookingTime: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
