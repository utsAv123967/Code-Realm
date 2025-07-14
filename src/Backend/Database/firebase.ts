// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC8x8ko0bnNBon2B-PvBIdEh5rX7GBsXYQ",
  authDomain: "code-realm-c021a.firebaseapp.com",
  projectId: "code-realm-c021a",
  storageBucket: "code-realm-c021a.firebasestorage.app",
  messagingSenderId: "607545985820",
  appId: "1:607545985820:web:e3024b52525c4193a3c8d9",
  measurementId: "G-BQGYE3EVY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const analytics = getAnalytics(app);
export { app, db, analytics };