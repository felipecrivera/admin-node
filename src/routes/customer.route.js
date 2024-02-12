const express = require("express");
const {
  signin,
  get,
  signup,
  getDashboard,
} = require("../controllers/customer.controller.js");
const { verifyToken } = require("../utils/Auth.js");
const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/get", verifyToken, get);
router.get("/getDashboard/:id", verifyToken, getDashboard);

module.exports = router;
