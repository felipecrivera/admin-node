const express = require("express");
const { verifyToken } = require("../utils/Auth.js");
const { edit, create } = require("../controllers/report.controller.js");

const router = express.Router();

router.post("/edit", verifyToken, edit);
router.post("/create", verifyToken, create);

module.exports = router;
