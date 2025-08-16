import { createSignal } from 'solid-js';
import { auth } from "../Backend/Database/firebase";
import { onAuthStateChanged, type User } from 'firebase/auth';
import { createUser } from "../Backend/Database/CreateUser";


const [currentUser, setCurrentUser] = createSignal<User | null>(null);
const [userId, setUserId] = createSignal<string | null>(null);
const [isLoading, setIsLoading] = createSignal(true);

onAuthStateChanged(auth, async (user) => {
  setCurrentUser(user);
  setUserId(user?.uid || null);
  setIsLoading(false);
  
  if (user) {
    try {
      // console.log("Syncing user to database:", user.uid);
      await createUser({
        userId: user.uid,
        name: user.displayName || "Anonymous User",
        email: user.email || "no-email@example.com"
      });
      // console.log("User data synced to database successfully");
    } catch (error: any) {
      console.error("Error syncing user to database:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
     
      if (error.code === 'permission-denied') {
        console.error("🔒 Firestore security rules are blocking this operation. Please update your security rules.");
      }
    }
  } else {
    console.log("User signed out");
  }
});


export const getUserId = () => userId();
export const getCurrentUser = () => currentUser();
export const getIsLoading = () => isLoading();
export { setCurrentUser, setUserId };

export { getUserId as userId };