
import Listing from "../db/model/listing.model.js";
import { errorHandler } from "../utils/error.js";
// create a listing controller to create listing
export const createListing = async (req, res, next) => {
   try {
    const listing= await Listing.create(req.body);
    return res.status(201).json(listing);
   } catch (error) {
    next(error)
   } 
}

// create a controller to access the user created listings
export const userListings = async (req,res,next)=>{
   // as we store user id in userRef in db at the time of creating a listin so it make it easy to access user data
   if (req.user._id===req.params.id){
      try {
         const listings=await Listing.find({userRef:req.params.id});
         res.status(200).json(listings)
         
      } catch (error) {
         next(error)
      }
   }
   else{
      return next(errorHandler(401,"You can only view your own listings!"));
   }
}

// create a controller to delete a listing
export const deleteListing=async(req,res,next)=>{
   const listing=await Listing.findById(req.params.id);
   if (!listing) return next(errorHandler(404,"Listing not found"));
   if (listing.userRef===req.user._id){
      try {
         await listing.deleteOne();
         res.status(200).json("Listing deleted successfully");
      } catch (error) {
         next(error)
      }
   }
   else{
      return next(errorHandler(401,"You can only delete your own listing!"));
   } 
}

// create a controller to update a listing
export const updateListing=async(req,res,next)=>{
   const listing=await Listing.findById(req.params.id);
   if (!listing) return next(errorHandler(404,"Listing not found"));
   if (req.user._id!==listing.userRef){
      return next(errorHandler(401,"You can only update your own listing!"));
   }
   try {
      const updatedListing=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
      res.status(200).json(updatedListing);
   } catch (error) {
      next(error)
   }
}

// create a controller to get the particuler listing data
export const getListing=async(req,res,next)=>{
   try {
      const listing=await Listing.findById(req.params.id);
       if(!listing) return next(errorHandler(404,"Listing not found"));
       res.status(200).json(listing);
   } catch (error) {
      next(error)
   }
}