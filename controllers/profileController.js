import User from "../models/User.js";

// GET /api/profile/me
export const getProfile = async (req, res) => {
  try {
    // req.user is populated by authenticate middleware
    const user = await User.findById(req.user.id).select("username email role createdAt");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, error: "Server error: " + err.message });
  }
};

// PUT /api/profile/update
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Update only provided fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, error: "Server error: " + err.message });
  }
};