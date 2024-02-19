import { Router } from "express";
import { verifyToken } from "../utils/Auth.js";
import { edit, create, get } from "../controllers/record.controller.js";

const router = Router();

router.patch("/edit/:id", verifyToken, edit);
router.post("/create", verifyToken, create);
router.post("/get", verifyToken, get);

export default router;
