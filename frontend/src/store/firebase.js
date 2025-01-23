// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgofPmjAfMJ7oITF-6Q6cYLKj8nz9v8ec",
  authDomain: "olchat-auth.firebaseapp.com",
  projectId: "olchat-auth",
  storageBucket: "olchat-auth.firebasestorage.app",
  messagingSenderId: "232862782311",
  appId: "1:232862782311:web:279651e6ef4149aecd95c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
