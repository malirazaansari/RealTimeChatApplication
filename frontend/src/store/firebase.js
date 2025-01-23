import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAgofPmjAfMJ7oITF-6Q6cYLKj8nz9v8ec",
  authDomain: "olchat-auth.firebaseapp.com",
  projectId: "olchat-auth",
  storageBucket: "olchat-auth.firebasestorage.app",
  messagingSenderId: "232862782311",
  appId: "1:232862782311:web:279651e6ef4149aecd95c2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
