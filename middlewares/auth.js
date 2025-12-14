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

    if(!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required."
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)

    // 4️⃣ Find user to check if still active
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found.",
      });
    }


    if(!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account is inactive.",
      });
    }


    if(!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email first."
      });
    }

    // 5️⃣ Attach user to request
    req.user = {
      id: user._id.toString(), //
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
                error: `Access denied. Required role: ${roles.join(" or ")}`,
            });
        }
        next()
    };
};


//Check if user is admin

export const isAdmin = (req, res, next) => {
  if(!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required.",
    });
  }

  if(req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin or manager missing.",
    });
  }
  next()
}


//Check if user is manager or admin

export const isManagerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required.",
    });
  }

  if(!["admin", "manager"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: "Manager or admin access required",
    });
  }

  next();
};

//Check resource ownership or admin
 //Allows user to access their own resources or admin to access any

 export const checkOwnershipOrAdmin = (resourceUserIdField = "authOId") => {
  return async (req, res, next) => {
    try {
      //Admin can access anything
      if(req.user.role === "admin") {
        return next();
      }

      //Check if user owns the resource
      const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

      if (resourceUserId && resourceUserId === req.user.id) {
        return next();
      }

      return res.status(403).json({
        success: false,
        error: "You can only access your own resourses."
      });
    } catch (error) {
      console.error("Ownership check error:", error);
      res.status(500).json({
        success: false,
        error: "Authorization failed.",
      });
    }
  };
 };



 //Rate limiting middleware (basic implementation)
 //For production, use redis-based rate limiting


 const requestCounts = new Map();

 export const rateLimit = (maxRequests = 100, windowsMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if(!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);

    //Remove old request the window
    const validRequests = requests.filter(time => now - time < windowsMs);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please try again later.",
      });
    }

    validRequests.push(now);
    requestCounts.set(ip, validRequests);

    next()
  }
 }








