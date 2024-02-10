const express = require("express");
const { verifyToken } = require("../utils/Auth.js");
const { edit, create, get } = require("../controllers/record.controller.js");

const router = express.Router();

router.patch("/edit/:id", edit);
router.post("/create", create);
router.get("/get", get);

module.exports = router;
