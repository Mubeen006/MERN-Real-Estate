import express from "express";
import { createListing ,userListings} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
// creating listing route
router.post("/createlisting",verifyUser ,createListing);
//accessing user created listings 
router.get("/listings/:id",verifyUser,userListings)
export default router;