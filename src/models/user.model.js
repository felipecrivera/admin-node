import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: String,
  userId: String,
  lastName: String,
  title: String,
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: String,
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const User = model("User", userSchema);

export default User;
