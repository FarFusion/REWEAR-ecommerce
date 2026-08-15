import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../src/models/Category.js";

dotenv.config();

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png",
    description: "Phones, laptops, tablets and other electronics",
  },
  {
    name: "Fashion",
    slug: "fashion",
    image: "https://cdn-icons-png.flaticon.com/512/3050/3050259.png",
    description: "Clothing, shoes and fashion accessories",
  },
  {
    name: "Home & Furniture",
    slug: "home-furniture",
    image: "https://cdn-icons-png.flaticon.com/512/1946/1946436.png",
    description: "Furniture and home essentials",
  },
  {
    name: "Books",
    slug: "books",
    image: "https://cdn-icons-png.flaticon.com/512/29/29302.png",
    description: "New and used books",
  },
  {
    name: "Gaming",
    slug: "gaming",
    image: "https://cdn-icons-png.flaticon.com/512/686/686589.png",
    description: "Gaming consoles, accessories and games",
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    image: "https://cdn-icons-png.flaticon.com/512/857/857455.png",
    description: "Sports equipment and fitness products",
  },
  {
    name: "Automotive",
    slug: "automotive",
    image: "https://cdn-icons-png.flaticon.com/512/741/741407.png",
    description: "Automotive parts and accessories",
  },
  {
    name: "Music",
    slug: "music",
    image: "https://cdn-icons-png.flaticon.com/512/3659/3659784.png",
    description: "Musical instruments and audio equipment",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    for (const category of categories) {
      await Category.updateOne(
        { slug: category.slug },
        { $set: category },
        { upsert: true }
      );
    }

    console.log("Categories seeded successfully.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Category seeding failed:", error);
    process.exit(1);
  }
};

seedCategories();