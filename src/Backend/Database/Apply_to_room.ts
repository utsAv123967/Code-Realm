import { doc, serverTimestamp,  updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export async function applyToRoom(roomId: string, userId: string) {
 
  if (!roomId || !userId) {
    throw new Error("Room ID and User ID are required");
  }
  
  try {
    const roomRef = doc(db, "Rooms", roomId);
    
    await updateDoc(roomRef, {
      Users: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
    
    
    return { success: true, message: "Successfully joined room" };
  } catch (error) {
    
    throw new Error("Failed to join room");
  }
}


