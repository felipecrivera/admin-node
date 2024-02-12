const express = require("express");
const { verifyToken } = require("../utils/Auth.js");
const { search } = require("../controllers/report.controller.js");

const router = express.Router();

router.get("/search", verifyToken, search);

module.exports = router;
