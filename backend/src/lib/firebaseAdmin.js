import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(
    new URL(
      "../firebase/olchat-auth-firebase-adminsdk-fbsvc-d2d4c04087.json",
      import.meta.url
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
