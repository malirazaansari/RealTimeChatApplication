import admin from "../lib/firebaseAdmin.js";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);

    // Optional: Validate audience or issuer (if necessary)
    // if (decodedToken.aud !== "<your-firebase-project-id>") {
    //   return res
    //     .status(403)
    //     .json({ error: "Token does not belong to this project." });
    // }

    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error("Token verification failed:", error.code, error.message);

    if (error.code === "auth/id-token-expired") {
      return res
        .status(403)
        .json({ error: "Token expired. Please log in again." });
    }

    res.status(403).json({ error: "Invalid or expired token" });
  }
};
