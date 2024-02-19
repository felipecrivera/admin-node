import { Schema, model } from "mongoose";

const recordSchema = Schema(
  {
    activationDate: {
      type: String,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign" },
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
    outcome: {
      type: String,
      enum: ["Booked Appt", "Send Info", "Callback"],
      required: true,
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

const Record = model("Record", recordSchema);

export default Record;
