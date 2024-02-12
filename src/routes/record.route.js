const express = require("express");
const { verifyToken } = require("../utils/Auth.js");
const { edit, create, get } = require("../controllers/record.controller.js");

const router = express.Router();

router.patch("/edit/:id", verifyToken, edit);
router.post("/create", verifyToken, create);
router.get("/get", verifyToken, get);

module.exports = router;
