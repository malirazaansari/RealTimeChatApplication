import express from "express";
import {
  checkAuth,
  login,
  logout,
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

router.post("/google-login", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    // Find or create the user in the database
    let user = await User.findOne({ firebaseId: uid });
    if (!user) {
      user = new User({
        firebaseId: uid,
        email,
        name,
        profilePicture: picture,
      });
      await user.save();
    }

    // Create a JWT for further authentication
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (error) {
    console.error("Error in Google login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
