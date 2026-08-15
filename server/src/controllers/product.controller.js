import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const createProduct =asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      brand,
      condition,
      price,
      originalPrice,
      images,
      location,
      stock,
    } = req.body;

    if (!title || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const product = await Product.create({
      title,
    description,
    category,
    seller: req.user.id,   // comes from auth middleware
    brand,
    condition,
    price,
    originalPrice,
    location,
    stock,
    images: req.body.images || [],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    seller: req.user.id,
  })
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

export const getProducts =asyncHandler(async (req, res) => {
  try {

    const {
      keyword,
      category,
      brand,
      condition,
      city,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "Available",
    };

    // Search
    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category) {
      query.category = category;
    }

    // Brand
    if (brand) {
      query.brand = brand;
    }

    // Condition
    if (condition) {
      query.condition = condition;
    }

    // City
    if (city) {
      query.location = city;
    }

    // Price

    if (minPrice || maxPrice) {

      query.price = {};

      if (minPrice)
        query.price.$gte = Number(minPrice);

      if (maxPrice)
        query.price.$lte = Number(maxPrice);

    }

    let sortOption = {};

    switch (sort) {

      case "priceAsc":
        sortOption.price = 1;
        break;

      case "priceDesc":
        sortOption.price = -1;
        break;

      case "rating":
        sortOption.averageRating = -1;
        break;

      default:
        sortOption.createdAt = -1;

    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("seller", "firstName lastName")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({

      success: true,

      total,

      page: Number(page),

      pages: Math.ceil(total / limit),

      data: products,

    });

  } catch (err) {

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }
});

export const getProductById =asyncHandler(async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("seller", "firstName lastName email")
      .populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

export const updateProduct =asyncHandler(async (req, res) => {
  try {
    const product = req.product;

    Object.assign(product, req.body);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = req.product;

    // Delete product images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (cloudinaryError) {
            console.error(
              `Failed to delete image ${image.public_id} from Cloudinary:`,
              cloudinaryError.message
            );
          }
        }
      }
    }

    // Delete product from MongoDB
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "rewear/products",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

export const uploadProductImages = asyncHandler(async (req, res) => {
  try {
    console.log("========== IMAGE UPLOAD ==========");
    console.log("Product ID:", req.params.id);
    console.log("Files:", req.files);
    console.log("Number of files:", req.files?.length);

    const product = req.product;

    console.log("Product:", product?._id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image.",
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      console.log("Uploading file:", file.originalname);
      console.log("Buffer exists:", !!file.buffer);

      const result = await uploadToCloudinary(file.buffer);

      console.log("Cloudinary result:", result);

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    product.images.push(...uploadedImages);

    await product.save();

    console.log("Images saved successfully");

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully.",
      data: product,
    });
  } catch (error) {
    console.error("========== IMAGE UPLOAD ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
});