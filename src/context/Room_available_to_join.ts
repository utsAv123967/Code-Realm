import { getDocs, collection } from "firebase/firestore";
import { db } from "../Backend/Database/firebase";
import { userId } from "./Userdetails";
import type { Room } from "../types";

export async function fetchAllRooms() {
  console.log("🔄 Fetching all rooms from database...");
  const querySnapshot = await getDocs(collection(db, "Rooms"));
  console.log("📋 Found", querySnapshot.docs.length, "rooms in database");
  
  const rooms: Room[] = querySnapshot.docs
    .map(doc => {
      const data = doc.data();
      console.log("🏠 Processing room:", doc.id, data);
      
      // Validate that the document has required Room properties
      if (data.Createdby && data.Name && data.Description !== undefined) { // Fixed: Allow empty string descriptions
        return {
          Applicants: data.Applicants || [],
          Createdby: data.Createdby,
          Description: data.Description,
          Messages: data.Messages || [],
          Name: data.Name,
          RoomId: doc.id,
          Tags: data.Tags || [],
          Users: data.Users || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          files: data.files || [],
          isActive: true,
        } as Room;
      } else {
        console.log("❌ Skipping invalid room:", doc.id, "Missing required fields");
      }
      return null;
    })
    .filter((room): room is Room => room !== null);

  console.log("✅ Valid rooms processed:", rooms.length);

  const created: Room[] = [];
  const joined: Room[] = [];
  const available: Room[] = []; // NEW: Available rooms to join

  const currentUserId = userId();
  console.log("👤 Current user ID:", currentUserId);
  
  for (const room of rooms) {
    if (currentUserId && room.Createdby === currentUserId) { // Fixed: Safely check user ID
      created.push(room);
      console.log("📝 Added to created rooms:", room.Name);
    } else if (currentUserId && room.Users?.includes(currentUserId)) { // Fixed: Safely check user ID
      joined.push(room);
      console.log("👥 Added to joined rooms:", room.Name);
    } else if (currentUserId && room.Createdby !== currentUserId && !room.Users?.includes(currentUserId)) {
      // NEW: Room not created by user and user hasn't joined it yet
      available.push(room);
      console.log("🔍 Added to available rooms:", room.Name);
    }
  }

  console.log("📊 Final results - Created:", created.length, "Joined:", joined.length, "Available:", available.length);

  return { createdRooms: created, joinedRooms: joined, availableRooms: available };
}
