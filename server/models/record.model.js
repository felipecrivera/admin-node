const mongoose = require("mongoose");

const recordSchema = mongoose.Schema(
  {
    activationDate: {
      type: String,
      required: true,
    },
    campaign: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    outCome: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: String,
      reuired: false,
    },
    bookingTime: {
      type: String,
      reuired: false,
    },
    notes: {
      type: String,
      reuired: false,
    },
  },
  { timestamps: true }
);

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
