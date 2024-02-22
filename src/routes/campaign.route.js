import { Router } from "express";
import {
  create,
  getAllCampaign,
  edit,
} from "../controllers/campaign.controller.js";
import { verifyToken } from "../utils/Auth.js";
const router = Router();

router.post("/create", verifyToken, create);
router.post("/edit/:id", verifyToken, edit);
router.post("/getAllCampaign/:id", verifyToken, getAllCampaign);

export default router;
