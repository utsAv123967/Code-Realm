import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

export async function createRoom({ Name, Createdby }) {
  const docRef = await addDoc(collection(db, "Rooms"), {
    Name,
    Createdby,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    files: [],
    Users: [],
    Messages: [],
    Applicants: {}
  });
  return docRef.id;
}


