import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateInvoice from "../utils/generateInvoice.js";
import sendEmail from "../utils/sendEmail.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return res.status(400).json({
      success: false,
      message: "Shipping address is required.",
    });
  }

  const cart = await Cart.findOne({
    user: req.user.id,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty.",
    });
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.images?.[0]?.url || "",
  }));

  const totalAmount = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // Generate invoice number
  const invoiceNumber = `RW-${Date.now()}`;

  const order = await Order.create({
    user: req.user.id,
    items,
    shippingAddress,
    totalAmount,
    invoiceNumber,
  }); 

  // Clear cart after successful order
  cart.items = [];
  await cart.save();

  const populatedOrder = await Order.findById(order._id)
    .populate("user", "firstName lastName email");


  //Generating Invoice

  try {
    const invoicePDF = await generateInvoice(populatedOrder);

    await sendEmail({
      to: populatedOrder.user.email,
      subject: `ReWear Order Invoice - ${invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Thank you for your order!</h2>

          <p>
            Hi ${populatedOrder.user.firstName},
          </p>

          <p>
            Your order has been successfully placed with ReWear.
          </p>

          <p>
            <strong>Order ID:</strong> ${populatedOrder._id}
          </p>

          <p>
            <strong>Invoice Number:</strong> ${invoiceNumber}
          </p>

          <p>
            <strong>Total Amount:</strong>
            ₹${totalAmount.toFixed(2)}
          </p>

          <p>
            Your invoice is attached to this email as a PDF.
          </p>

          <p>
            Thank you for shopping with ReWear!
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `ReWear-Invoice-${invoiceNumber}.pdf`,
          content: invoicePDF,
          contentType: "application/pdf",
        },
      ],
    });

    // Mark invoice email as sent
    order.invoiceEmailSent = true;
    await order.save();
  } catch (invoiceError) {
    console.error(
      "Invoice generation/email failed:",
      invoiceError
    );
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully.",
    data: populatedOrder,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user.id,
  })
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate("items.product");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getAllOrders = asyncHandler(
  async (req, res) => {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  }
);

export const updateOrderStatus = asyncHandler(
  async (req, res) => {
    const { status, paymentStatus } = req.body;

    const allowedStatuses = [
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    const allowedPaymentStatuses = [
      "Pending",
      "Paid",
      "Failed",
      "Refunded",
    ];

    // Validate order status only if provided
    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    // Validate payment status only if provided
    if (
      paymentStatus !== undefined &&
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Update only the fields that were provided
    if (status !== undefined) {
      order.status = status;
    }

    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    const updatedOrder = await Order.findById(
      order._id
    )
      .populate(
        "user",
        "firstName lastName email"
      )
      .populate("items.product");

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data: updatedOrder,
    });
  }
);