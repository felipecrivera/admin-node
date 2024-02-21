import { Router } from "express";
import { create } from "../controllers/conversations.controller.js";
import { verifyToken } from "../utils/Auth.js";
const router = Router();

router.post("/create", verifyToken, create);

export default router;
