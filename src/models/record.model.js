import { Schema, model } from "mongoose";

const recordSchema = Schema(
  {
    activationDate: {
      type: Date,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign" },
    firstName: {
      type: String,
    },
    company: {
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
      enum: ["Booked Appt", "Send Info", "Callback", ""],
    },
    bookingDate: {
      type: Date,
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

const Record = model("Record", recordSchema);

export default Record;
