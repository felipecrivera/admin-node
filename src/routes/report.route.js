import { Router } from "express";
import { verifyToken } from "../utils/Auth.js";
import { search } from "../controllers/report.controller.js";

const router = Router();

router.post("/search", verifyToken, search);

export default router;
