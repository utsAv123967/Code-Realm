// Chat Message Cleanup Utility
// This can be run as a scheduled job or cloud function to clean up old messages

import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  deleteDoc,
  doc,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "../Backend/Database/firebase";

/**
 * Clean up old chat messages to prevent storage bloat
 * Standard approach: Keep last 200 messages per room, delete older ones
 */
export async function cleanupOldMessages(roomId?: string) {
  try {
    const messagesRef = collection(db, "ChatMessages");
    
    if (roomId) {
      // Clean up specific room
      await cleanupRoomMessages(roomId);
    } else {
      // Clean up all rooms
      const roomsSnapshot = await getDocs(collection(db, "Rooms"));
      for (const roomDoc of roomsSnapshot.docs) {
        await cleanupRoomMessages(roomDoc.id);
      }
    }
  } catch (error) {
    console.error("Error cleaning up messages:", error);
  }
}

async function cleanupRoomMessages(roomId: string) {
  const messagesRef = collection(db, "ChatMessages");
  
  // Get all messages for this room, ordered by timestamp (newest first)
  const q = query(
    messagesRef,
    where("roomId", "==", roomId),
    orderBy("timestamp", "desc")
  );
  
  const snapshot = await getDocs(q);
  const messages = snapshot.docs;
  
  // Keep newest 200 messages, delete the rest
  const MESSAGES_TO_KEEP = 200;
  
  if (messages.length > MESSAGES_TO_KEEP) {
    const messagesToDelete = messages.slice(MESSAGES_TO_KEEP);
    
    console.log(`Cleaning up ${messagesToDelete.length} old messages from room ${roomId}`);
    
    // Delete old messages in batches
    const batchSize = 10;
    for (let i = 0; i < messagesToDelete.length; i += batchSize) {
      const batch = messagesToDelete.slice(i, i + batchSize);
      await Promise.all(
        batch.map(msgDoc => deleteDoc(doc(db, "ChatMessages", msgDoc.id)))
      );
    }
  }
}

/**
 * Delete messages older than X days
 */
export async function deleteOldMessages(daysOld: number = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const messagesRef = collection(db, "ChatMessages");
    const q = query(
      messagesRef,
      where("timestamp", "<", Timestamp.fromDate(cutoffDate))
    );
    
    const snapshot = await getDocs(q);
    
    console.log(`Deleting ${snapshot.docs.length} messages older than ${daysOld} days`);
    
    // Delete in batches
    const batchSize = 10;
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      const batch = snapshot.docs.slice(i, i + batchSize);
      await Promise.all(
        batch.map(doc => deleteDoc(doc.ref))
      );
    }
  } catch (error) {
    console.error("Error deleting old messages:", error);
  }
}

/*
STANDARD CHAT MESSAGE STORAGE APPROACH:

1. REAL-TIME MESSAGES:
   - Store messages in Firestore for real-time sync
   - Use onSnapshot for instant updates across all users
   - Each message has: roomId, sender, content, timestamp, type

2. MESSAGE RETENTION:
   - Keep last 100-200 messages per room for active chat
   - Auto-delete messages older than 30 days
   - Use cloud functions or scheduled tasks for cleanup

3. PERFORMANCE OPTIMIZATION:
   - Limit queries to recent messages (last 100)
   - Use pagination for chat history if needed
   - Client-side sorting to avoid composite indexes

4. STORAGE COSTS:
   - Each message ~100-500 bytes
   - 1000 messages ≈ 0.5MB storage
   - Auto-cleanup keeps costs minimal

5. REAL-TIME UPDATES:
   - onSnapshot automatically syncs new messages
   - No polling needed - truly real-time
   - Works across all browser tabs/devices instantly

USAGE:
- For development: Messages auto-cleanup after 200 per room
- For production: Set up cloud function to run cleanup weekly
- Cost effective: Keeps only recent, relevant messages
*/
