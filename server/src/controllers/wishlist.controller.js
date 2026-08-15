import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// Add product to wishlist
export const addToWishlist =asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const exists = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Already in wishlist.",
      });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      product: productId,
    });

    res.status(201).json({
      success: true,
      message: "Added to wishlist.",
      data: wishlistItem,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

// Get wishlist
export const getWishlist =asyncHandler(async (req, res) => {
  try {

    const wishlist = await Wishlist.find({
      user: req.user.id,
    })
      .populate({
        path: "product",
        populate: {
          path: "category",
          select: "name",
        },
      });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      data: wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});


// Remove from wishlist
export const removeFromWishlist =asyncHandler(async (req, res) => {

  try {

    await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: req.params.productId,
    });

    res.status(200).json({
      success: true,
      message: "Removed from wishlist.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});