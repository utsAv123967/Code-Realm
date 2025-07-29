// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration - using environment variables with fallback to your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC8x8ko0bnNBon2B-PvBIdEh5rX7GBsXYQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "code-realm-c021a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "code-realm-c021a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "code-realm-c021a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "607545985820",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:607545985820:web:e3024b52525c4193a3c8d9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BQGYE3EVY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Expose Firebase auth globally for debugging
if (typeof window !== 'undefined') {
  (window as any).firebaseAuth = auth;
  (window as any).firebaseApp = app;
  (window as any).firebaseDb = db;
  console.log('🔥 Firebase auth exposed globally as window.firebaseAuth');
}

export { app, db, auth, analytics };