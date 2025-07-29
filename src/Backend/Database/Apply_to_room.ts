import { doc, serverTimestamp, setDoc, updateDoc, arrayUnion, addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";



export async function applyToRoom(roomId: string, userId: string) {
  console.log("Applying to room:", { roomId, userId });
  
  // Validate required fields
  if (!roomId || !userId) {
    throw new Error("Room ID and User ID are required");
  }
  
  try {
    const roomRef = doc(db, "Rooms", roomId);
    
    // Add user to the Users array
    await updateDoc(roomRef, {
      Users: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
    
    console.log("User successfully added to room:", roomId);
    return { success: true, message: "Successfully joined room" };
  } catch (error) {
    console.error("Error applying to room:", error);
    throw new Error("Failed to join room");
  }
}


