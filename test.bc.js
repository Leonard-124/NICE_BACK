// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Define upload directory
// const uploadDir = path.join(process.cwd(), "uploads");

// // ✅ Check if uploads folder exists before creating
// if (!fs.existsSync(uploadDir)) {
//   try {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log("✅ Uploads folder created.");
//   } catch (err) {
//     console.error("❌ Error creating uploads folder:", err);
//   }
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// // File filter (optional)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only PDF or DOC allowed."), false);
//   }
// };

// // Export configured multer
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
// });

// export default upload;
/////////////////////////
// role: {
//     type: String,
//     enum: ["user", "manager", "admin"],
//     default: "user",
// },//
// isEmailVerified: {
//     type: Boolean,
//     default: false,
// },//
// emailVerificationToken: String,
// emailVerificationExpires: Date,
// passwordResetToken: String,
// passwordResetExpires: Date,
// failedLoginAttempts: {
//     type: Number,
//     default: 0,
// },
// accountLockedUntil: Date,
// lastLogin: Date,
// isActive: {
//     type: Boolean,
//     default: true,
// },
//////////
// Increment failed login attempts
// userSchema.methods.incrementLoginAttempts = async function () {
//   // Reset attempts if lock has expired
//   if (this.accountLockedUntil && this.accountLockedUntil < Date.now()) {
//     await this.updateOne({
//       $set: {
//         failedLoginAttempts: 1,
//         accountLockedUntil: undefined,
//       },
//     });
//     return;
//   }

//   const updates = { $inc: { failedLoginAttempts: 1 } };
  
//   // Lock account after 5 failed attempts
//   if (this.failedLoginAttempts + 1 >= 5) {
//     updates.$set = { accountLockedUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
//   }
  
//   await this.updateOne(updates);
// };

// // Reset login attempts
// userSchema.methods.resetLoginAttempts = async function () {
//   await this.updateOne({
//     $set: {
//       failedLoginAttempts: 0,
//       accountLockedUntil: undefined,
//       lastLogin: Date.now(),
//     },
//   });
// };
///////////////////
//.select -> specifies doc field to include or exclude
////
// GET /api/profile/me
// export const getProfile = async (req, res) => {
//   try {
//     // req.user is populated by authenticate middleware
//     const user = await User.findById(req.user.id).select("username email role createdAt");

//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found." });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id.toString(),
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ success: false, error: "Server error: " + err.message });
//   }
// };
//////////////////
// PUT /api/profile/update
// export const updateProfile = async (req, res) => {
//   try {
//     const { username, email } = req.body;

//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found." });
//     }

//     // Update only provided fields
//     if (username) user.username = username;
//     if (email) user.email = email;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully.",
//       user: {
//         id: user._id.toString(),
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Update profile error:", err);
//     res.status(500).json({ success: false, error: "Server error: " + err.message });
//   }
// };
///////////////////
// import cloudinary from "../config/cloudinary.js"
// import mongoose from "mongoose"

// export const createProduct = async (req, res) => {
//     try{
//         if(!req.file) {
//             return res.status(400).json({error: "Image file is required"})
//         }

//         //Upload to cloudinary
//         const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//             folder: "Productss"
//         });

//         const {name, category, description, quantity, oldPrice, newPrice} = req.body

//         const newProduct = new Product({
//             imageUrl: uploadResult.secure_url,
//             publicId: uploadResult.public_id,
//             name,
//             quantity,
//             description,
//             category,
//             oldPrice,
//             newPrice
//         });
        
//         const savedProduct = await newProduct.save()
//         res.status(201).json(savedProduct)

//     } catch (err) {
//         console.error("Error creating art, err");
//         res.status(500).json({err: err.message})
//     }
// };
////////////////////
// export const updateProduct = async (req, res) => {
//     try{
//         const {name, description, category, quantity, oldPrice, newPrice} = req.body
//         const updates = {name, description, category, quantity, oldPrice, newPrice};
//         if(req.file) {
//             const products = await Product.findById(req.params.id);
//             if(!products) return res.status(404).json({error: "Not found"})
//         if(products.publicId) {
//             await cloudinary.uploader.destroy(products.publicId)
//         }

//         const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//             folder: "Productss",
//         });

//         updates.image = uploadResult.secure_url;
//         updates.publicId = uploadResult.public_id
//         }
//         const products = await Product.findByIdAndUpdate(req.params.id, updates, {new: true, runValidators: true});

//         if(!products) return res.status(404).json({error: "Not found"});
//         res.json(products)
        
//     } catch (err) {
//         res.status(500).json({error: err.message})
//     }
// }
////////////////////
// export const deleteProduct = async (req, res) => {
//     try{
//         const products = await Product.findByIdAndDelete(req.params.id);
//         if(!products) return res.status(404).json({error: "Not found"});

//         if(products.publicId) {
//             await cloudinary.uploader.destroy(products.publicId)
//         }
//         await products.deleteOne(); //removes doc_ from db.
//         res.json({message: "Deleted successfully"})
//     } catch (err) {
//         res.status(500).json({error: err.message})
//     }
// }
////////////////////Enforce this component?
// export const getUserArtworks = async (req, res) => {
//   console.log("req.auth.sub:", req.auth?.sub);
//   console.log("req.params.auth0Id:", req.params.auth0Id);

//   try {
//     const { auth0Id } = req.params;

//     // ✅ enforce ownership
//     if (req.auth?.sub !== auth0Id) {
//       return res.status(403).json({ message: "Forbidden: not your profile" });
//     }

//     const artworks = await Art.find({ auth0Id });
//     res.status(200).json(artworks);
//   } catch (err) {
//     console.error("Error fetching user artworks:", err);
//     res.status(500).json({ message: "Server error fetching user artworks" });
//   }
// };
/////////////
// export const sendWelcomeEmail = async (recipientEmail, username, role) => {
//   const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//   sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
//   sendSmtpEmail.to = [{ email: recipientEmail, name: username }];
//   sendSmtpEmail.subject = "Welcome to Ibonnis - Get Started! 🎉";
//   sendSmtpEmail.htmlContent = `
//     <!DOCTYPE html>
//     <html>
//       <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h1 style="color: #667eea;">Welcome to Ibonnis, ${username}! 🎨</h1>
//           <p>Your email has been verified successfully!</p>
          
//           <div style="background: #f0f7ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
//             <h3>🚀 Get Started:</h3>
//             <ul>
//               <li><strong>Are you a builder:</strong> Share your projects with us and lets build together.</li>
//               <li><strong>Join:</strong>Be part of the IBONNIS community</li>
//               <li><strong>Innovators:</strong> Start sharing your inventions with us.</li>
//               ${role === 'admin' ? '<li><strong>Admin Access:</strong> Manage the platform</li>' : ''}
//               ${role === 'manager' ? '<li><strong>Manager Access:</strong> Moderate content</li>' : ''}
//             </ul>
//           </div>
          
//           <a href="${FRONTEND_URL}/profile" 
//              style="display: inline-block; padding: 15px 30px; background: #667eea; 
//                     color: white; text-decoration: none; border-radius: 5px; 
//                     font-weight: bold;">
//             Go to Your Profile
//           </a>
          
//           <p style="margin-top: 30px; color: #777;">
//             Need help? Visit our <a href="${FRONTEND_URL}/help">Help Center</a>
//           </p>
//         </div>
//       </body>
//     </html>
//   `;

//   try {
//     await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log(`✅ Welcome email sent to ${recipientEmail}`);
//   } catch (error) {
//     console.error("❌ Brevo welcome email error:", error);
//   }
// };
//////////////////////////
// export const sendLoginNotification = async (recipientEmail, username, loginDetails) => {
//   const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//   sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
//   sendSmtpEmail.to = [{ email: recipientEmail, name: username }];
//   sendSmtpEmail.subject = "New Login to Your Ibonnis Account";
//   sendSmtpEmail.htmlContent = `
//     <!DOCTYPE html>
//     <html>
//       <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2>🔐 New Login Detected</h2>
//           <p>Hello ${username},</p>
//           <p>We detected a new login to your Ibonnis account:</p>
          
//           <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
//             <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
//             <p><strong>IP Address:</strong> ${loginDetails.ip || 'Unknown'}</p>
//             <p><strong>Device:</strong> ${loginDetails.userAgent || 'Unknown'}</p>
//           </div>
          
//           <p>If this was you, you can ignore this email.</p>
//           <p>If you didn't log in, please secure your account immediately:</p>
//           <a href="${FRONTEND_URL}/reset-password" 
//              style="display: inline-block; padding: 10px 20px; background: #dc3545; 
//                     color: white; text-decoration: none; border-radius: 5px;">
//             Reset Password
//           </a>
//         </div>
//       </body>
//     </html>
//   `;

//   try {
//     await apiInstance.sendTransacEmail(sendSmtpEmail);
//   } catch (error) {
//     console.error("❌ Brevo login notification error:", error);
//   }
// };
//////////////////
// if (role && role !== "user") {
// // Check if requester is admin (implement proper auth check)
// return res.status(403).json({
// success: false,
// error: "Only administrators can create admin/manager accounts.",
// });
// }
////////////////
// const existingUser = await User.findOne({
//     $or: [{ email }, { username }],
// });
////////////////
// export const resendVerification = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });//finds one _doc

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found.",
//       });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({
//         success: false,
//         error: "Email already verified.",
//       });
//     }

//     const verificationToken = user.generateEmailVerificationToken();
//     await user.save();

//     await sendVerificationEmail(email, user.username, verificationToken);

//     res.status(200).json({
//       success: true,
//       message: "Verification email sent successfully.",
//     });
//   } catch (error) {
//     console.error("Resend verification error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to resend verification email.",
//     });
//   }
// };
/////////////////
// // Find user (include password for verification)
// const user = await User.findOne({
//     $or: [{ username }, { email: username }],
// }).select("+password"); //adds password for

// if (!user) {
//     return res.status(401).json({
//     success: false,
//     error: "Invalid credentials.",
//     });
// }

// // Check if account is locked
// if (user.isAccountLocked()) {
//     return res.status(423).json({
//     success: false,
//     error: "Account is locked due to too many failed login attempts. Try again later.",
//     });
// }

// // Check if account is active
// if (!user.isActive) {
//     return res.status(403).json({
//     success: false,
//     error: "Your account has been deactivated. Contact support.",
//     });
// }

// // Verify password
// const isMatch = await user.comparePassword(password);

// if (!isMatch) {
//     await user.incrementLoginAttempts();
//     return res.status(401).json({
//     success: false,
//     error: "Invalid credentials.",
//     });
// }
//////////////////////
// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password"); //excludes password sort of.

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         isEmailVerified: user.isEmailVerified,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to fetch user data.",
//     });
//   }
// };
//////////////////////////////
// export const getAllUsers = async (req, res) => {
//     try {
//         const {page = 1, limit = 20, role, search} = req.query;
//         const query = {};

//         if (role && role !== "all") {
//             query.role = role;
//         }

//         if (search) {
//             query.$or = [
//                 {username: { $regex: search, $options: "i"}},
//                 { email: { $regex: search, $options: "i"}},
//             ];
//         }

//         const users = await User.find(query)
//         .select("-password")
//         .limit(limit * 1)
//         .skip((page - 1) * limit)
//         .sort({createdAt: -1});

//         const count = await User.countDocuments(query);

//         res.status(200).json({
//             success: true,
//             users,
//             totalPage: page, //.
//             total: count,//.
//         });
//     } catch (error) {
//         console.error("Get users error:", error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to fetch users.",
//         });
//     }
// };
/////////////////
// export const getStats = async (req, res) => {
//     try {
//         const totalUsers = await User.countDocuments();
//         const totalAdmins = await User.countDocuments({role: "admin"});
//         const totalManagers = await User.countDocuments({role: "manager"});
//         const verifiedUsers = await User.countDocuments({isEmailVerified: true});
//         const activeUsers = await User.countDocuments({isActive: true});

//         //Recent registration (last 30 days)

//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//         const recentRegistrations = await User.countDocuments({
//             createdAt: { $gte: thirtyDaysAgo },
//         });

//         res.status(200).json({
//             success: true,
//             stats: {
//                 totalUsers,
//                 totalAdmins,
//                 totalManagers,
//                 verifiedUsers,
//                 activeUsers,
//                 recentRegistrations,
//                 verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0,
//             },
//         });
//     } catch (error) {
//         console.error("Get stats error:", error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to fetch statistics.",
//         });
//     }
// };
///////////////////////
// export const unlockAccount = async (req, res) => {
//     try{
//         const {id} = req.params;

//         const user = await User.findByIdAndUpdate(
//             id, {
//                 failedLoginAttempts: 0,
//                 accountLockedUntil: undefined,
//             },
//             {new: true}
//         ).select("-password");

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 error: "User not found.",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Account unlocked successfully.",
//             user,
//         });
//     } catch (error) {
//         console.error("Unlock account error:", error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to unlock account.",
//         })
//     }
// }
////////////////////
// export const isManagerOrAdmin = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({
//       success: false,
//       error: "Authentication required.",
//     });
//   }

//   if(!["admin", "manager"].includes(req.user.role)) {
//     return res.status(403).json({
//       success: false,
//       error: "Manager or admin access required",
//     });
//   }

//   next();
// };
//////////////////////
//  const requestCounts = new Map();

//  export const rateLimit = (maxRequests = 100, windowsMs = 15 * 60 * 1000) => {
//   return (req, res, next) => {
//     const ip = req.ip;
//     const now = Date.now();

//     if(!requestCounts.has(ip)) {
//       requestCounts.set(ip, []);
//     }

//     const requests = requestCounts.get(ip);

//     //Remove old request the window
//     const validRequests = requests.filter(time => now - time < windowsMs);

//     if (validRequests.length >= maxRequests) {
//       return res.status(429).json({
//         success: false,
//         error: "Too many requests. Please try again later.",
//       });
//     }

//     validRequests.push(now);
//     requestCounts.set(ip, validRequests);

//     next()
//   }
//  }
////////////////////