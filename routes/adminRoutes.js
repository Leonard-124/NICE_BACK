import express from 'express'
import { getAllUsers, getUserById, updateUserRole, toggleUserStatus, deleteUser, getStats, forceVerifyEmail, unlockAccount } from '../controllers/adminController.js';

import { authenticate, isAdmin, isManagerOrAdmin } from "../middlewares/auth.js";

const router = express.Router();


//All routes require authentication
router.use(authenticate);

router.get("/users", isAdmin, getAllUsers);

router.get("/users/:id", isManagerOrAdmin, getUserById);

router.put("/users/:id/role", isAdmin, updateUserRole);
router.patch("/users/:id/toggle-status", isAdmin, toggleUserStatus);
router.delete("/users/:id", isAdmin, deleteUser);
router.get("/stats", isAdmin, getStats);
router.patch("/users/:id/verify-email", isAdmin, forceVerifyEmail);
router.patch("/users/:id/unlock", isAdmin, unlockAccount);

export default router;