import dotenv from "dotenv";

dotenv.config();

const { default: sendEmail } = await import("./sendEmail.js");

const testEmail = async () => {
  try {
    const result = await sendEmail({
      to: "encode650@gmail.com",
      subject: "ReWear Email Test",
      html: `
        <h2>ReWear Email Test</h2>
        <p>If you received this email, Resend is working correctly.</p>
      `,
    });

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Email test failed:", error);
  }
};

testEmail();