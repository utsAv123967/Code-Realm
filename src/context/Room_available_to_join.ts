import { getDocs, collection } from "firebase/firestore";
import { db } from "../Backend/Database/firebase";
import { userId } from "./Userdetails";
import type { Room } from "../types";

export async function fetchAllRooms() {
  const querySnapshot = await getDocs(collection(db, "Rooms"));
  
  const rooms: Room[] = querySnapshot.docs
    .map(doc => {
      const data = doc.data();
      if (data.Createdby && data.Name && data.Description !== undefined) { // 
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
      }
      // else {
      //   console.log("❌ Skipping invalid room:", doc.id, "Missing required fields");
      // }
      return null;
    })
    .filter((room): room is Room => room !== null);


  const created: Room[] = [];
  const joined: Room[] = [];
  const available: Room[] = []; // Available rooms to join

  const currentUserId = userId();
  
  for (const room of rooms) {
    if (currentUserId && room.Createdby === currentUserId) { 
      created.push(room);
    } else if (currentUserId && room.Users?.includes(currentUserId)) {  
      joined.push(room);
    } else if (currentUserId && room.Createdby !== currentUserId && !room.Users?.includes(currentUserId)) {
      
      available.push(room);
      
    }
  }

  

  return { createdRooms: created, joinedRooms: joined, availableRooms: available };
}
