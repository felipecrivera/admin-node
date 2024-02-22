import { Schema, model } from "mongoose";

const customerSchema = Schema(
  {
    AccountName: {
      type: String,
    },
    AccountId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    bookingGoal: {
      type: Number,
      default: 0,
    },
    activationGoal: {
      type: Number,
      default: 0,
    },
    dashboardDisplay: {
      type: String,
      enum: ["Booking", "Activation", "Both"],
      default: "Both",
    },
    visibleDashboards: [
      {
        type: String,
        enum: ["Booking", "Activation"],
      },
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    campaigns: [
      {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
  },
  { timestamps: true }
);

const Customer = model("Customer", customerSchema);

export default Customer;
