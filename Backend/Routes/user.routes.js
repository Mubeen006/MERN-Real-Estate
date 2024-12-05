import express from "express";

const router = express.Router();

router.get("/user", (req, res) => {
    res.send("Hello World! from router");
});
export default router;