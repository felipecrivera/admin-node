import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import customerRouter from "./routes/customer.route.js";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import recordRouter from "./routes/record.route.js";
import reportRouter from "./routes/report.route.js";
import campaignRouter from "./routes/campaign.route.js";
import conversationRouter from "./routes/conversation.route.js";

config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/admin", adminRouter);
app.use("/customer", customerRouter);
app.use("/record", recordRouter);
app.use("/report", reportRouter);
app.use("/user", userRouter);
app.use("/campaign", campaignRouter);
app.use("/conversation", conversationRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

mongoose.connect(process.env.DB_URI);

mongoose.connection.on("connection", () => {
  console.log("Connected to DB!");
});

mongoose.connection.on("error", (err) => {
  console.log("Error while connecting to DB", err);
});

app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
