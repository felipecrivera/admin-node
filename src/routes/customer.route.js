const express = require("express");
const {
  signin,
  userSignin,
  get,
  signup,
  getDashboard,
  edit,
  me
} = require("../controllers/customer.controller.js");
const { verifyToken } = require("../utils/Auth.js");
const router = express.Router();

router.post("/signin", signin);
router.post("/edit/:id", edit);

router.post("/signup", signup);
router.post("/get", verifyToken, get);
router.post("/me", verifyToken, me);
router.post("/getDashboard/:id", verifyToken, getDashboard);

module.exports = router;
