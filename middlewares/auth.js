import jwt from "jsonwebtoken";
import User from "../models/User.js";



export const authenticate = async (req, res, next) => {
  try {
    // 1️⃣ Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization header missing or malformed.",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)

    // 4️⃣ Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(403).json({
        success: false,
        error: "User not found.",
      });
    }

    // 5️⃣ Attach user to request
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    // 6️⃣ Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please refresh.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        error: "Invalid token.",
      });
    }

    // 7️⃣ Catch-all
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication failed.",
    });
  }
};

/// Authorize specific roles

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                error: "Authentication required.",
            })
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Required role: ${roles.join(" or ")}`
            });
        }
        next()
    };
};











// export const authenticate = async (req, res, next) => {
//     try {
//         const authHeader = req.headers["authorization"]
//         const token = authHeader && authHeader.split(" ")[1];

//         if(!token) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Access token required."
//             })
//         }
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const user = await User.findById(decoded.id).select("-password");
//         if(!user) {
//             return res.status(403).json({
//                 success: false,
//                 error: "User not found."
//             })
//         }

//         req.user = {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role
//         };
//         next();
//     } catch (error) {
    
//         if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         error: "Token expired. Please refresh.",
//       });
//     }

//     if (error.name === "JsonWebTokenError") {
//       return res.status(403).json({
//         success: false,
//         error: "Invalid token.",
//       });
//     }

//     console.error("Authentication error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Authentication failed.",
//     });
//   }

// }