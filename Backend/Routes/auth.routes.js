import express from "express";
import { googlelogin, login, signup, signout } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/google", googlelogin)
router.get("/signout", signout)
export default router;   
