import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    
    // Added 'country', 'state', and 'city' fields to match frontend data structure
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
    },

    regularPrice: {
        type: Number,
        required: true,
    },

    discountPrice: {
        type: Number,
        validate: {
            // Added validation to ensure discountPrice is less than regularPrice
            validator: function(value) {
                return !this.offer || value < this.regularPrice;
            },
            message: "Discount price must be less than the regular price."
        },
    },

    bathrooms: {
        type: Number,
        required: true,
    },
    
    bedrooms: {
        type: Number,
        required: true,
    },

    parking: {
        type: Boolean,
        required: true,
    },

    furnished: {
        type: Boolean,
        required: true,
    },

    offer: {
        type: Boolean,
        required: true,
    },

    // Updated 'imagesLink' type to include validation for an array of URLs
    imagesLink: {
        type: [String],
        required: true,
        validate: {
            validator: function(value) {
                return value.length > 0 && value.every(url => typeof url === "string");
            },
            message: "ImagesLink must contain at least one valid URL."
        }
    },

    userRef: {
        type: String,
        required: true,
    },
},
{ timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
