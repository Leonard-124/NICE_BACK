
// import { register, login,logout, refresh } from "../controllers/authController.js";
// import express from "express"

// const router = express.Router();

// router.post("/register", register)
// router.post("/login", login)
// router.post("/refresh", refresh)
// router.post("/logout", logout)

// export default router;
//////////////////////////////////

// Routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/authController.js"
import {
  authenticate,
  rateLimit,
} from "../middlewares/auth.js"

const router = express.Router();

// Public routes with rate limiting
router.post("/register", rateLimit(5, 60 * 60 * 1000), register); // 5 per hour
router.post("/login", rateLimit(10, 15 * 60 * 1000), login); // 10 per 15 min
router.post("/refresh", rateLimit(20, 60 * 60 * 1000), refresh); // 20 per hour
router.post("/logout", logout);

// Email verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", rateLimit(3, 60 * 60 * 1000), resendVerification); // 3 per hour

// Password reset
router.post("/forgot-password", rateLimit(3, 60 * 60 * 1000), forgotPassword); // 3 per hour
router.post("/reset-password", rateLimit(5, 60 * 60 * 1000), resetPassword); // 5 per hour

// Protected routes
router.get("/me", authenticate, getCurrentUser);

export default router;


