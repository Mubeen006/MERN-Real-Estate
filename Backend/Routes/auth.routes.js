import express from "express";
import { googlelogin, login, signup, signout } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/google", googlelogin)
router.get("/signout/:id",verifyUser ,signout)
export default router;   
