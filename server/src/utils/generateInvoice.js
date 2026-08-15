import PDFDocument from "pdfkit";

const generateInvoice = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      const buffers = [];

      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc.on("error", reject);

      // =========================
      // HEADER
      // =========================

      doc
        .fontSize(26)
        .font("Helvetica-Bold")
        .text("ReWear");

      doc
        .fontSize(11)
        .font("Helvetica")
        .text("Second Life Marketplace");

      doc.moveDown();

      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("INVOICE");

      doc.moveDown();

      // =========================
      // INVOICE INFORMATION
      // =========================

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Invoice Number: ${order.invoiceNumber}`)
        .text(`Order ID: ${order._id}`)
        .text(
          `Order Date: ${new Date(order.createdAt).toLocaleDateString(
            "en-IN"
          )}`
        );

      doc.moveDown();

      // =========================
      // CUSTOMER
      // =========================

      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .text("Bill To");

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        )
        .text(order.user?.email || "")
        .text(`Phone: ${order.shippingAddress.phone}`)
        .text(order.shippingAddress.address)
        .text(
          `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
        );

      doc.moveDown();

      // =========================
      // ITEMS
      // =========================

      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .text("Order Items");

      doc.moveDown(0.5);

      const tableTop = doc.y;

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Product", 50, tableTop)
        .text("Qty", 330, tableTop)
        .text("Price", 380, tableTop)
        .text("Total", 450, tableTop);

      doc.moveTo(50, tableTop + 18)
        .lineTo(550, tableTop + 18)
        .stroke();

      let currentY = tableTop + 28;

      doc.font("Helvetica");

      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;

        doc
          .fontSize(10)
          .text(item.title, 50, currentY, {
            width: 250,
          })
          .text(String(item.quantity), 330, currentY)
          .text(`₹${item.price.toFixed(2)}`, 380, currentY)
          .text(`₹${itemTotal.toFixed(2)}`, 450, currentY);

        currentY += 25;
      });

      doc.moveTo(50, currentY)
        .lineTo(550, currentY)
        .stroke();

      currentY += 20;

      // =========================
      // TOTAL
      // =========================

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(
          `Total Amount: ₹${order.totalAmount.toFixed(2)}`,
          380,
          currentY
        );

      currentY += 25;

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          `Payment Status: ${order.paymentStatus}`,
          380,
          currentY
        )
        .text(
          `Order Status: ${order.status}`,
          380,
          currentY + 18
        );

      // =========================
      // FOOTER
      // =========================

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          "Thank you for shopping with ReWear!",
          50,
          740,
          {
            align: "center",
            width: 500,
          }
        );

      doc
        .fontSize(9)
        .text(
          "This is a computer-generated invoice.",
          50,
          755,
          {
            align: "center",
            width: 500,
          }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoice;