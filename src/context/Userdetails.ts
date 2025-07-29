import { createSignal } from 'solid-js';
import { auth } from "../Backend/Database/firebase";
import { onAuthStateChanged, type User } from 'firebase/auth';
import { createUser } from "../Backend/Database/CreateUser";

// Create reactive user state
const [currentUser, setCurrentUser] = createSignal<User | null>(null);
const [userId, setUserId] = createSignal<string | null>(null);
const [isLoading, setIsLoading] = createSignal(true);

// Listen to authentication state changes
onAuthStateChanged(auth, async (user) => {
  setCurrentUser(user);
  setUserId(user?.uid || null);
  setIsLoading(false);
  
  if (user) {
    // User is signed in, create/update user in database
    try {
      console.log("Syncing user to database:", user.uid);
      await createUser({
        userId: user.uid,
        name: user.displayName || "Anonymous User",
        email: user.email || "no-email@example.com"
      });
      console.log("User data synced to database successfully");
    } catch (error: any) {
      console.error("Error syncing user to database:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // Check if it's a permissions error
      if (error.code === 'permission-denied') {
        console.error("🔒 Firestore security rules are blocking this operation. Please update your security rules.");
      }
    }
  } else {
    console.log("User signed out");
  }
});

// Export getter functions and setters
export const getUserId = () => userId();
export const getCurrentUser = () => currentUser();
export const getIsLoading = () => isLoading();
export { setCurrentUser, setUserId };

// Legacy export for backward compatibility
export { getUserId as userId };