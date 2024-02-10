const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const customerRouter = require("./routes/customer.route.js");
const recordRouter = require("./routes/record.route.js");
const reportRouter = require("./routes/report.route.js");
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/customer", customerRouter);
app.use("/record", recordRouter);
app.use("/report", reportRouter);

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
