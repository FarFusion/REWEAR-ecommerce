import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    condition: {
      type: String,
      enum: ["Like New", "Excellent", "Good", "Fair"],
      default: "Good",
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    location: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },

    views: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    averageRating:{
      type:Number,
      default:0
    },

    numReviews:{
      type:Number,
      default:0
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);