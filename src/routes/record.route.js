import { Router } from "express";
import { verifyToken } from "../utils/Auth.js";
import {
  edit,
  create,
  createOne,
  get,
} from "../controllers/record.controller.js";

const router = Router();

router.patch("/edit/:id", verifyToken, edit);
router.post("/create", verifyToken, create);
router.post("/createOne", verifyToken, createOne);
router.post("/get", verifyToken, get);

export default router;
