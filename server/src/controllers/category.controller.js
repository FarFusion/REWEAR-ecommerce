import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const createCategory =asyncHandler(async (req, res) => {
  try {
    const { name, image, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const exists = await Category.findOne({ slug });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await Category.create({
      name,
      slug,
      image,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const getCategories =asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});