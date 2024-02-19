import { Schema, model } from "mongoose";

const customerSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
