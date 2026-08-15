import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/user.routes.js";





const app = express();

//console.log("CLIENT_URL =", process.env.CLIENT_URL);

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to ReWear API"
    });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/wishlist", wishlistRoutes);

app.use("/api/v1/cart", cartRoutes);

app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/reviews",reviewRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/users", userRoutes);


app.use(errorHandler);

export default app;