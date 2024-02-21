import { Schema, model } from "mongoose";

const conversationSchema = new Schema({
  date: Date,
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  count: Number,
});

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
