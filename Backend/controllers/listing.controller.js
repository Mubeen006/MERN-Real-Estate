import Listing from "../db/model/listing.model.js";
import { errorHandler } from "../utils/error.js";
// create a listing controller to create listing
export const createListing = async (req, res, next) => {
  try {
    // Extract data from request body
    const {
      title,
      description,
      address,
      country,
      state,
      city,
      type,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      parking,
      furnished,
      offer,
      imagesLink,
      userRef
    } = req.body;

    // Validate discountPrice if offer is true
    if (offer && discountPrice >= regularPrice) {
      return res.status(400).json({
        message: "Discount price must be less than regular price when an offer is active."
      });
    }

    // Ensure imagesLink contains at least one valid URL
    if (!Array.isArray(imagesLink) || imagesLink.length === 0) {
      return res.status(400).json({
        message: "At least one valid image URL is required."
      });
    }

    // Create a new listing instance
    const listing = await Listing.create({
      title,
      description,
      address,
      country,
      state,
      city,
      type,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      parking,
      furnished,
      offer,
      imagesLink,
      userRef
    });

    // Send success response
    return res.status(201).json(listing);
  } catch (error) {
    // Handle errors
    next(error);
  }
};

// create a controller to access the user created listings
export const userListings = async (req, res, next) => {
  // as we store user id in userRef in db at the time of creating a listin so it make it easy to access user data
  if (req.user._id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

// create a controller to delete a listing
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (listing.userRef === req.user._id) {
    try {
      await listing.deleteOne();
      res.status(200).json("Listing deleted successfully");
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only delete your own listing!"));
  }
};

// create a controller to update a listing
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (req.user._id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing!"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// create a controller to get the particuler listing data
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
// create a controller to get all listings data
export const getListings = async (req, res, next) => {
  try {
    // limit('query') mean like how many data we want to return like /listings?limit=10
    const limit = parseInt(req.query.limit) || 9;
    // start index if there is now query then start index will be 0
    const startIndex = parseInt(req.query.startIndex) || 0;
    // now to get listing data of offer or not offer we need to check if offer in not defined
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      // search both offer and not offer listings
      offer = { $in: [true, false] }; // $in mean search in database
    }
    // same for furnished and parking
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }
    // if there is no type is defined then get both rent and sale listings
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }
    // to provide filter search term
    let searchTerm = req.query.searchTerm || ""; // '' if ther is now search term use provide all listings to
    // to sort data accordign to query or createdAt
    let sort = req.query.sort || "createdAt";
    // sort order
    let order = req.query.order || "desc";

    // now to get listing data
    const listings = await Listing.find({
      /*regex is biltin functionality of mongodb
          which provide a way to search data based on regular expression
         "i" mean dont care about case sensitive*/
      title: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    }) /* sort to any oder we want to provide */
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
