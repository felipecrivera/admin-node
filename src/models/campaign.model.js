import { Schema, model } from "mongoose";

const campaignSchema = new Schema({
  name: String,
  description: String,
  type: {
    type: String,
    enum: ["Activate", "Boost"],
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const Campaign = model("Campaign", campaignSchema);

export default Campaign;
