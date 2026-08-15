import bcrypt from "bcrypt";
import crypto from "crypto";

import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// ==========================================
// SEND VERIFICATION OTP EMAIL
// ==========================================

const sendVerificationEmail = async (user, otp) => {
  await sendEmail({
    to: user.email,

    subject: "Your ReWear Verification OTP",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        "
      >

        <h2>Welcome to ReWear, ${user.firstName}!</h2>

        <p>
          Thank you for creating your ReWear account.
        </p>

        <p>
          Your verification OTP is:
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            margin: 20px 0;
          "
        >
          ${otp}
        </div>

        <p>
          This OTP will expire in
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not create this account,
          you can safely ignore this email.
        </p>

      </div>
    `,
  });
};


// ==========================================
// REGISTER
// ==========================================

export const register = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    let user = await User.findOne({
      email: normalizedEmail,
    });


    // ==========================================
    // EXISTING USER
    // ==========================================

    if (user) {

      // Already verified
      if (user.isVerified) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }


      // Existing but not verified
      const otp = crypto
        .randomInt(100000, 1000000)
        .toString();

      const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

      user.verificationOTP = hashedOTP;

      user.verificationOTPExpires = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await user.save();

      await sendVerificationEmail(user, otp);

      return res.status(200).json({
        success: true,
        message: "A new OTP has been sent to your email.",
        email: user.email,
      });
    }


    // ==========================================
    // CREATE NEW USER
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user = await User.create({
      firstName: firstName.trim(),

      lastName: lastName.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      role: "user",

      isVerified: false,

      verificationOTP: hashedOTP,

      verificationOTPExpires: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });


    // Send OTP
    await sendVerificationEmail(user, otp);


    return res.status(201).json({
      success: true,

      message:
        "Registration successful. Please check your email for the OTP.",

      email: user.email,
    });

  } catch (error) {

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
});


// ==========================================
// LOGIN
// ==========================================

export const login = asyncHandler(async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }


    // Find user
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });


    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }


    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }


    // Email verification check
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }


    // Generate JWT
    const token = generateToken(
      user._id,
      user.role
    );


    // Remove password
    const userResponse =
      user.toObject();

    delete userResponse.password;


    // HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,

      secure: false,

      sameSite: "lax",

      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });


    return res.status(200).json({
      success: true,

      message: "Login successful.",

      token,

      data: userResponse,
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = asyncHandler(
  async (req, res) => {

    try {

      const {
        email,
        otp,
      } = req.body;


      // Validation
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message:
            "Email and OTP are required.",
        });
      }


      const normalizedEmail =
        email.trim().toLowerCase();


      // Find user
      const user = await User.findOne({
        email: normalizedEmail,
      });


      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }


      // Already verified
      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message:
            "Email is already verified.",
        });
      }


      // OTP doesn't exist
      if (
        !user.verificationOTP ||
        !user.verificationOTPExpires
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No verification OTP found. Please request a new OTP.",
        });
      }


      // OTP expired
      if (
        user.verificationOTPExpires <
        new Date()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }


      // Hash submitted OTP
      const hashedOTP =
        crypto
          .createHash("sha256")
          .update(otp.toString())
          .digest("hex");


      // Compare OTP
      if (
        hashedOTP !==
        user.verificationOTP
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP.",
        });
      }


      // Verify account
      user.isVerified = true;

      user.verificationOTP = null;

      user.verificationOTPExpires =
        null;

      await user.save();


      return res.status(200).json({
        success: true,

        message:
          "Email verified successfully.",
      });

    } catch (error) {

      console.error(
        "Verify OTP error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "OTP verification failed.",
      });
    }
  }
);


// ==========================================
// RESEND OTP
// ==========================================

export const resendOTP = asyncHandler(
  async (req, res) => {

    try {

      const { email } = req.body;


      if (!email) {
        return res.status(400).json({
          success: false,
          message:
            "Email is required.",
        });
      }


      const normalizedEmail =
        email.trim().toLowerCase();


      const user = await User.findOne({
        email: normalizedEmail,
      });


      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found.",
        });
      }


      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message:
            "Email is already verified.",
        });
      }


      // Generate OTP
      const otp = crypto
        .randomInt(100000, 1000000)
        .toString();


      // Hash OTP
      const hashedOTP =
        crypto
          .createHash("sha256")
          .update(otp)
          .digest("hex");


      user.verificationOTP =
        hashedOTP;


      user.verificationOTPExpires =
        new Date(
          Date.now() +
            10 * 60 * 1000
        );


      await user.save();


      // Send email
      await sendVerificationEmail(
        user,
        otp
      );


      return res.status(200).json({
        success: true,

        message:
          "A new OTP has been sent to your email.",
      });

    } catch (error) {

      console.error(
        "Resend OTP error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to resend OTP.",
      });
    }
  }
);

// ==========================================
// GET PROFILE
// ==========================================

export const getProfile =
  asyncHandler(async (req, res) => {

    const user =
      await User.findById(
        req.user.id
      ).select("-password");


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }


    res.status(200).json({
      success: true,
      data: user,
    });
  });


// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile =
  asyncHandler(async (req, res) => {

    const {
      firstName,
      lastName,
      phone,
      avatar,
    } = req.body;


    const user =
      await User.findById(
        req.user.id
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }


    if (firstName !== undefined) {
      user.firstName = firstName;
    }

    if (lastName !== undefined) {
      user.lastName = lastName;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }


    await user.save();


    res.status(200).json({
      success: true,

      message:
        "Profile updated successfully.",

      data: {
        _id: user._id,

        firstName:
          user.firstName,

        lastName:
          user.lastName,

        email:
          user.email,

        phone:
          user.phone,

        avatar:
          user.avatar,

        role:
          user.role,

        isVerified:
          user.isVerified,

        createdAt:
          user.createdAt,

        updatedAt:
          user.updatedAt,
      },
    });
  });
  
// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Generate 6-digit OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Hash OTP before storing it
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordOTP = hashedOTP;

    // OTP expires in 10 minutes
    user.resetPasswordOTPExpires =
      new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "ReWear Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Reset Your ReWear Password</h2>

          <p>
            We received a request to reset your password.
          </p>

          <p>Your password reset OTP is:</p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            ReWear Team
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully.",
      email: user.email,
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send password reset OTP.",
    });
  }
});


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required.",
      });
    }

    if (otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      !user.resetPasswordOTP ||
      !user.resetPasswordOTPExpires
    ) {
      return res.status(400).json({
        success: false,
        message: "No password reset OTP found. Please request a new OTP.",
      });
    }

    if (
      user.resetPasswordOTPExpires.getTime() <
      Date.now()
    ) {
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Hash submitted OTP
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOTP !== user.resetPasswordOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    // Clear reset OTP
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password.",
    });
  }
});

// ==========================================
// GET SAVED ADDRESSES
// ==========================================

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("addresses");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: user.addresses,
  });
});


// ==========================================
// ADD ADDRESS
// ==========================================

export const addAddress = asyncHandler(async (req, res) => {
  const {
    label,
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    pincode,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    return res.status(400).json({
      success: false,
      message: "All address fields are required.",
    });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // First address automatically becomes default
  const isDefault = user.addresses.length === 0;

  if (isDefault) {
    user.addresses.forEach((item) => {
      item.isDefault = false;
    });
  }

  const newAddress = {
    label: label || "Home",
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    isDefault,
  };

  user.addresses.push(newAddress);

  await user.save();

  res.status(201).json({
    success: true,
    message: "Address added successfully.",
    data: user.addresses,
  });
});


// ==========================================
// UPDATE ADDRESS
// ==========================================

export const updateAddress = asyncHandler(async (req, res) => {
  const {
    label,
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    pincode,
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const savedAddress = user.addresses.id(req.params.addressId);

  if (!savedAddress) {
    return res.status(404).json({
      success: false,
      message: "Address not found.",
    });
  }

  if (label !== undefined) savedAddress.label = label;
  if (firstName !== undefined) savedAddress.firstName = firstName.trim();
  if (lastName !== undefined) savedAddress.lastName = lastName.trim();
  if (phone !== undefined) savedAddress.phone = phone.trim();
  if (address !== undefined) savedAddress.address = address.trim();
  if (city !== undefined) savedAddress.city = city.trim();
  if (state !== undefined) savedAddress.state = state.trim();
  if (pincode !== undefined) savedAddress.pincode = pincode.trim();

  await user.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully.",
    data: user.addresses,
  });
});


// ==========================================
// DELETE ADDRESS
// ==========================================

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found.",
    });
  }

  const wasDefault = address.isDefault;

  address.deleteOne();

  // If default address was deleted,
  // make the first remaining address default.
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Address deleted successfully.",
    data: user.addresses,
  });
});


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found.",
    });
  }

  user.addresses.forEach((item) => {
    item.isDefault = item._id.equals(address._id);
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Default address updated.",
    data: user.addresses,
  });
});


const uploadAvatarToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "rewear/avatars",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });


export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please select an image.",
    });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const result = await uploadAvatarToCloudinary(req.file.buffer);

  user.avatar = result.secure_url;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully.",
    data: user,
  });
});