import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// 🔥 Protected Route (this is what we were missing)
router.get("/me", protect, getCurrentUser);

export default router;
