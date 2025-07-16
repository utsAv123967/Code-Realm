import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import uuid from "uuid"; // Import uuid to generate unique IDs

export async function createRoom({ Name, Createdby, Description, Tags }) {
  const roomId = uuid();
  const docRef = await setDoc(doc(db, "Rooms", roomId), {
    Roomid: roomId,
    Name,
    Createdby,
    Description,
    Tags,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    files: [],
    Users: [],
    Messages: [],
    Applicants: {},
  });
  return roomId;
}