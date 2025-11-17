// import User from "../models/User.js";
// import crypto from "crypto";
// import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from "../Utils/token.js";

// //import bcrypt from "bcryptjs";

// //let RefreshTokens = []





// export const register = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     // 1️⃣ Validate required fields
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: "All fields are required." });
//     } 
//     // Vlidate password strength
//     if(password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         error: "Password must be at least 8 characters long."
//       })
//     }

//     //Only admins can create admin/manager accounts
//     if(role && role !== 'user') {
//       return res.status(403).json({
//         success: false,
//         error: "Only admins can create admin/manager accounts."
//       })
//     }

//     // 2️⃣ Check if user already exists
//     // const existingUser = await User.findOne({ email });
//     // if (existingUser) {
//     //   return res.status(409).json({ error: "User already exists." });
//     // }
//     const existingUser = await User.findOne({
//       $or: [{email}, {username}],
//     });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         error: existingUser.email === email
//         ? "Email is already registered."
//         : "Username is already taken."
//       })
//     }

//     // 3️⃣ Create new user (password hashing handled by Mongoose middleware)
//     const newUser = new User({
//       username,
//       email,
//       password,
//     role: role || 'user' ,
//       });
//     await newUser.save();

//     // 4️⃣ Exclude password before sending response
//     //const { password: _, ...userData } = newUser._doc;

//     // 5️⃣ Send success response
//     res.status(201).json({
//       success: true,
//       message: "Registration successful Please check your email for verification!",
//       user: {
//         id:newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//         role: newUser.role
//       }
//     });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ error: "Registration failed: " + err.message });
//   }
// };


// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // 1️⃣ Validate input
//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         error: "Username and password are required.",
//       });
//     }

//     // 2️⃣ Find user by username OR email, include password
//     const user = await User.findOne({
//       $or: [{ username: username }, { email: username }],
//     }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid username or email",
//       });
//     }

//     // 3️⃣ Compare passwords
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid credentials",
//       });
//     }

//     // 4️⃣ Generate tokens
//     const accessToken = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     // 5️⃣ Return success response
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       accessToken,
//       refreshToken,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({
//       success: false,
//       error: "Login failed: " + err.message,
//     });
//   }
// };




// export const refresh = async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) {
//       return res.status(400).json({ success: false, error: "Refresh token required" });
//     }

//     let payload;
//     try {
//       payload = verifyRefreshToken(token);
//     } catch {
//       return res.status(403).json({ success: false, error: "Invalid or expired refresh token" });
//     }

//     // payload.id is now a string
//     const user = await User.findById(payload.id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }

//     const newAccessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     res.status(200).json({
//       success: true,
//       message: "Token refreshed successfully",
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//     });
//   } catch (err) {
//     console.error("Refresh error:", err);
//     res.status(500).json({ success: false, error: "Refresh failed: " + err.message });
//   }
// };




// // At the top of your file
// let refreshTokens = [];

// export const logout = (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({ error: "Refresh token required" });
//     }

//     // Remove token from in-memory list
//     refreshTokens = refreshTokens.filter((t) => t !== token);

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error: " + err.message });
//   }
// };

import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../Utils/token.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters long." });
    }

    // Restrict role creation in open registration
    if (role && role !== "user") {
      return res.status(403).json({ success: false, error: "Only admins can create admin/manager accounts." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: existingUser.email === email ? "Email is already registered." : "Username is already taken.",
      });
    }

    // Create new user (password hashing handled by Mongoose middleware)
    const newUser = new User({
      username,
      email,
      password,
      role: role || "user",
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification!",
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: "Registration failed: " + err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required." });
    }

    // Find user by username OR email
    const user = await User.findOne({ $or: [{ username }, { email: username }] }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid username or email." });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }

    // Generate tokens (pass full user object)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Login failed: " + err.message });
  }
};

// REFRESH
export const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: "Refresh token required." });
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return res.status(403).json({ success: false, error: "Invalid or expired refresh token." });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ success: false, error: "Refresh failed: " + err.message });
  }
};

// LOGOUT (in-memory demo; replace with DB storage in production)
let refreshTokens = [];

export const logout = (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: "Refresh token required." });
    }

    refreshTokens = refreshTokens.filter((t) => t !== token);

    res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, error: "Server error: " + err.message });
  }
};


