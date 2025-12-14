

// controllers/authController.js
import User from "../models/User.js"
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../Utils/token.js"
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendLoginNotification,
} from "./emailService.js"

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Username, email, and password are required.",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long.",
      });
    }

    // Only admins can create admin/manager accounts
    if (role && role !== "user") {
      // Check if requester is admin (implement proper auth check)
      return res.status(403).json({
        success: false,
        error: "Only administrators can create admin/manager accounts.",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: existingUser.email === email
          ? "Email already registered."
          : "Username already taken.",
      });
    }

    // Create user
    const newUser = new User({
      username,
      email,
      password,
      role: role || "user",
    });

    // Generate email verification token
    const verificationToken = newUser.generateEmailVerificationToken();
    await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, username, verificationToken);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Continue registration even if email fails
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification token.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username, user.role);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now login.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      error: "Verification failed. Please try again.",
    });
  }
};

/**
 * Resend verification email
 */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: "Email already verified.",
      });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    await sendVerificationEmail(email, user.username, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to resend verification email.",
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required.",
      });
    }

    // Find user (include password for verification)
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return res.status(423).json({
        success: false,
        error: "Account is locked due to too many failed login attempts. Try again later.",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Your account has been deactivated. Contact support.",
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email before logging in.",
        needsVerification: true,
      });
    }

    // Reset login attempts
    await user.resetLoginAttempts();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send login notification (optional, for security)
    try {
      await sendLoginNotification(user.email, user.username, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (emailError) {
      console.error("Login notification failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again.",
    });
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Refresh token required.",
      });
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(403).json({
        success: false,
        error: "Invalid or expired refresh token.",
      });
    }

    const user = await User.findById(payload.id);

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: "User not found or account inactive.",
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      error: "Token refresh failed.",
    });
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      await sendPasswordResetEmail(email, user.username, resetToken);
      
      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email.",
      });
    } catch (emailError) {
      // If email fails, clear the token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      console.error("Email send error:", emailError);
      
      return res.status(500).json({
        success: false,
        error: "Failed to send reset email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process password reset request.",
    });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token.",
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now login.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      error: "Password reset failed.",
    });
  }
};

/**
 * Logout
 */
export const logout = (req, res) => {
  try {
    // In a production app, you'd invalidate the refresh token in a database/Redis
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Logout failed.",
    });
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data.",
    });
  }
};