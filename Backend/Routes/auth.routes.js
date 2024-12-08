import express from "express";
import { googlelogin, login, signup } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/google", googlelogin)
export default router;   
