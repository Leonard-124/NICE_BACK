
const express = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const { isAuthenticated } = require("../middlewares/oauth20.cjs");

const router = express.Router();

// Throttle auth attempts to slow down abuse/credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts, please try again later." },
});

// Kick off Google OAuth
router.get(
  "/google",
  authLimiter,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google redirects back here
router.get(
  "/google/callback",
  authLimiter,
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: true,
  }),
  (req, res) => {
    // Regenerate the session on login to prevent session fixation
    req.session.save(() => {
      res.redirect(`${process.env.CLIENT_URL}/profile`);
    });
  }
);

router.get("/profile", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// passport@0.6+ made logout async and requires a callback
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;