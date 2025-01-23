import admin from "../lib/firebaseAdmin.js";

export const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
