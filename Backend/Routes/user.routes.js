import express from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import upload from "../utils/multerUpload.js";

const router = express.Router();

router.get("/user", (req, res) => {
    res.send("Hello World! from router");
});

// Route to update user data 
router.post("/update/:id", verifyUser, upload.single('file'),updateUser);
// Route to delete user
router.delete("/delete/:id", verifyUser, deleteUser);
export default router;