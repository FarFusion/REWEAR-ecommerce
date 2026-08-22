// import nodemailer from "nodemailer";
import dotenv from "dotenv";



// const sendEmail = async ({
//   to,
//   subject,
//   html,
//   attachments = [],
// }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       family: 4,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailData = {
//       from: `"ReWear" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//       attachments,
//     };

//     const info = await transporter.sendMail(mailData);

//     console.log("Email sent:", info.messageId);

//     return info;
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     throw error;
//   }
// };

import { Resend } from "resend";

console.log("🔥 RESEND EMAIL SERVICE LOADED");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {
  try {
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      html,
    };

    if (attachments.length > 0) {
      emailData.attachments = attachments;
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("RESEND ERROR:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data.id);

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendEmail;