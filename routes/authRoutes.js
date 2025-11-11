
import { register, login,logout, refresh } from "../controllers/authController";
import express from "express"

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/refresh", refresh)
router.get("/logout", logout)

export default router;


