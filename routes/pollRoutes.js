import express from "express";
import { getPollHistory } from "../controller/pollController.js";

const router = express.Router();

router.get("/history", getPollHistory);

export default router;
