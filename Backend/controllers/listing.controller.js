
import Listing from "../db/model/listing.model.js";
// create a listing controller to create listing
export const createListing = async (req, res, next) => {
   try {
    const listing= await Listing.create(req.body);
    return res.status(201).json(listing);
   } catch (error) {
    next(error)
   } 
}