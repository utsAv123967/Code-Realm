import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Add a file to a room's files array in Firestore
 * @param roomId - The ID of the room to add the file to
 * @param fileName - The name of the file to add
 */
export const AddFile = async (roomId: string, fileName: string) => {
  try {
    console.log("📁 Adding file to room:", { roomId, fileName });

    const roomRef = doc(db, "Rooms", roomId);
    
    await updateDoc(roomRef, {
      files: arrayUnion(fileName),
      updatedAt: new Date()
    });

    console.log("✅ File added successfully to room");
    return { success: true };
  } catch (error) {
    console.error("❌ Error adding file to room:", error);
    return { success: false, error };
  }
};

export default AddFile;