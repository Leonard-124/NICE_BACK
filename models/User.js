// Models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: Date,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isAccountLocked = function () {
  return this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  
  return resetToken;
};

// Increment failed login attempts
userSchema.methods.incrementLoginAttempts = async function () {
  // Reset attempts if lock has expired
  if (this.accountLockedUntil && this.accountLockedUntil < Date.now()) {
    await this.updateOne({
      $set: {
        failedLoginAttempts: 1,
        accountLockedUntil: undefined,
      },
    });
    return;
  }

  const updates = { $inc: { failedLoginAttempts: 1 } };
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts + 1 >= 5) {
    updates.$set = { accountLockedUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  await this.updateOne({
    $set: {
      failedLoginAttempts: 0,
      accountLockedUntil: undefined,
      lastLogin: Date.now(),
    },
  });
};

// Index for performance
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });
// userSchema.index({ role: 1 });

export default mongoose.model("User", userSchema);