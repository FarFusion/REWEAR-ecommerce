import nodemailer from "nodemailer";
import dotenv from "dotenv";




const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      family: 4,

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return transporter;
  } catch (error) {
    console.error("Transporter creation failed:", error);
    throw error;
  }
};

const verifyTransporter = (transporter) => {
  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP CONNECTION ERROR:", error);
        reject(error);
      } else {
        console.log("SMTP SERVER READY:", success);
        resolve(success);
      }
    });
  });
};

const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {
  try {
    const transporter = createTransporter();

    await verifyTransporter(transporter);

    const info = await transporter.sendMail({
      from: `"ReWear" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendEmail;