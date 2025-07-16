import { getDocs, collection } from "firebase/firestore";
import { db } from "../Backend/Database/firebase";

// This function is compatible with createResource
export async function fetchAllRooms() {
  const querySnapshot = await getDocs(collection(db, "Rooms"));
  const rooms = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return rooms;
}
