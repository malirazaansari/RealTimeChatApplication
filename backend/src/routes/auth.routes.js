import express from "express";
import {
  checkAuth,
  login,
  logout,
  signInWithGoogle,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

router.post("/google-login", verifyFirebaseToken, signInWithGoogle);

export default router;
