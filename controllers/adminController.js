
import User from "../models/User.js"
//import Art from "../Models/artmodel.js"



export const getAllUsers = async (req, res) => {
    try {
        const {page = 1, limit = 20, role, search} = req.query;
        const query = {};

        if (role && role !== "all") {
            query.role = role;
        }

        if (search) {
            query.$or = [
                {username: { $regex: search, $options: "i"}},
                { email: { $regex: search, $options: "i"}},
            ];
        }

        const users = await User.find(query)
        .select("-password")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({createdAt: -1});

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            users,
            totalPage: page,
            total: count,
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch users.",
        });
    }
};

//Get user by ID (admin/manager)

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user."
        });
    }
};

//Update user role (admin only)

export const updateUserRole = async (req, res) => {
    try {
        const {role} = req.body;
        const {id} = req.params;

        if(!["user", "manager", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                error: "Invalid role. Must be: user, manager or admin"
            });
        }

        //Prevent self-demotion
        if(id === req.user.id) {
            return res.status(400).json({
                success: false,
                error: "You cannot change your own role."
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            {role},
            {new: true, runValidators: true}
        ).select("-password");

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}.`,
            user,
        });
    }catch (error) {
        console.error("Updated role error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update user role.",
        });
    }
};

//Deactivate / Activate user account (admin only)

export const toggleUserStatus = async (req, res) => {
    try{
        const {id} = req.params;

        //Prevent self-deactivation
        if(id === req.user.id) {
            return res.status(400).json({
                success: false,
                error: "You cannot deactivate your own account."
            });
        }

        const user = await User.findById(id);
        
        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found."
            })
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User account ${user.isActive ? "activated" : "deactivate"}.`,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error("Toggle status error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update user status.",
        });
    }
};

//Delete user (admin only)

export const deleteUser = async (req, res) => {
    try {
        const {id} = req. params;

        //Prevent self deletion
        if(id === req.user.id) {
            return res.status(400).json({
                success: false,
                error: "You cannot delete your own account.",
            });
        }

        const user = await User.findByIdAndDelete(id)

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found.",
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete user.",
        });
    }
};


//Get plartform statistics (admin only)

export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({role: "admin"});
        const totalManagers = await User.countDocuments({role: "manager"});
        const verifiedUsers = await User.countDocuments({isEmailVerified: true});
        const activeUsers = await User.countDocuments({isActive: true});

        //Recent registration (last 30 days)

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRegistrations = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
        });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalManagers,
                verifiedUsers,
                activeUsers,
                recentRegistrations,
                verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0,
            },
        });
    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch statistics.",
        });
    }
};


//Force verify user email (admin only)

export const forceVerifyEmail = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            {isEmailVerified: true, emailVerificationToken: undefined, emailVerificationExpires: undefined,
            },
            {new: true}
        ).select("-password")

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User email verified successfully.",
            user,
        });
    } catch (error) {
        console.error("Force verify error:". error);
        res.status(500).json({
            success: false,
            error: "Failed to verify email."
        });
    }
};

//Unlock user a/c (admin only)

export const unlockAccount = async (req, res) => {
    try{
        const {id} = req.params;

        const user = await User.findByIdAndUpdate(
            id, {
                failedLoginAttempts: 0,
                accountLockedUntil: undefined,
            },
            {new: true}
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Account unlocked successfully.",
            user,
        });
    } catch (error) {
        console.error("Unlock account error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to unlock account.",
        })
    }
}