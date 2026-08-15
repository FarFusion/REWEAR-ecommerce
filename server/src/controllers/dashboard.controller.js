import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const sellerDashboard =asyncHandler(async (req, res) => {
  try {

    const sellerId = req.user.id;

    const products = await Product.find({
      seller: sellerId,
    });

    const totalProducts = products.length;

    const availableProducts = products.filter(
      p => p.stock > 0
    ).length;

    const outOfStock = products.filter(
      p => p.stock === 0
    ).length;

    const productIds = products.map(
      p => p._id
    );

    const orders = await Order.find({
      "items.product": {
        $in: productIds,
      },
    });

    let revenue = 0;

    orders.forEach(order => {

      order.items.forEach(item => {

        if (
          productIds.some(
            id => id.equals(item.product)
          )
        ) {

          revenue += item.price * item.quantity;

        }

      });

    });

    const avgRating =
      products.length === 0
        ? 0
        : (
            products.reduce(
              (sum, p) => sum + p.averageRating,
              0
            ) / products.length
          ).toFixed(1);

    res.json({

      success: true,

      data: {

        totalProducts,

        availableProducts,

        outOfStock,

        totalOrders: orders.length,

        revenue,

        averageRating: avgRating,

      },

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),

    Product.countDocuments(),

    Order.countDocuments(),

    Order.countDocuments({ status: "Pending" }),

    Order.countDocuments({ status: "Confirmed" }),

    Order.countDocuments({ status: "Shipped" }),

    Order.countDocuments({ status: "Delivered" }),

    Order.countDocuments({ status: "Cancelled" }),

    Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          status: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]),

    Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const totalRevenue = 
    revenueResult.length > 0
      ? revenueResult[0].total
      : 0;

  res.status(200).json({
    success: true,

    data: {
      statistics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },

      orderStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },

      recentOrders,
    },
  });
});