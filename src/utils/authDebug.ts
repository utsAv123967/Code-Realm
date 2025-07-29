import { getCurrentUser, getUserId, getIsLoading } from "../context/Userdetails";
import { auth } from "../Backend/Database/firebase";

// Debug utility to check authentication status
export const checkAuthStatus = () => {
  console.log("=== Authentication Debug Info ===");
  
  // Check SolidJS signals
  const user = getCurrentUser();
  const userId = getUserId();
  const isLoading = getIsLoading();
  
  console.log("🔍 SolidJS Auth State:");
  console.log("  - Current User:", user);
  console.log("  - User ID:", userId);
  console.log("  - Is Loading:", isLoading);
  
  // Check Firebase Auth directly
  console.log("🔥 Firebase Auth:");
  console.log("  - Firebase User:", auth.currentUser);
  console.log("  - User UID:", auth.currentUser?.uid);
  console.log("  - User Email:", auth.currentUser?.email);
  console.log("  - User Display Name:", auth.currentUser?.displayName);
  
  // Check browser storage
  console.log("💾 Browser Storage:");
  console.log("  - LocalStorage keys:", Object.keys(localStorage));
  console.log("  - SessionStorage keys:", Object.keys(sessionStorage));
  
  // Look for Firebase-specific storage
  const firebaseKeys = Object.keys(localStorage).filter(key => 
    key.includes('firebase') || key.includes('auth')
  );
  console.log("  - Firebase storage keys:", firebaseKeys);
  
  firebaseKeys.forEach(key => {
    console.log(`    ${key}:`, localStorage.getItem(key));
  });
  
  // Check if user is authenticated
  const isAuthenticated = !!auth.currentUser;
  console.log("✅ Authentication Status:", isAuthenticated ? "LOGGED IN" : "NOT LOGGED IN");
  
  return {
    isAuthenticated,
    user: auth.currentUser,
    solidUser: user,
    userId,
    isLoading
  };
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).checkAuth = checkAuthStatus;
}
