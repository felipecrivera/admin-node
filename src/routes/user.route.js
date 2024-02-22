import { Router } from "express";
import { create, getAllUsers, edit } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/Auth.js";
const router = Router();

router.post("/create", create);
router.post("/edit/:id", edit);
router.post("/getAllUser/:id", verifyToken, getAllUsers);

export default router;
