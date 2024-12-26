import express from "express";
import { createListing ,deleteListing,userListings,updateListing,getListing} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
// creating listing route
router.post("/createlisting",verifyUser ,createListing);
//accessing user created listings 
router.get("/listings/:id",verifyUser,userListings)
// deleting listing of user
router .delete("/deletelisting/:id",verifyUser,deleteListing)
//edit user listing
router.post("/updatelisting/:id",verifyUser,updateListing);
// get the listing data by id, we did not need to use verify user middleware because every one can view listing
router.get("/getlisting/:id",getListing)
export default router;