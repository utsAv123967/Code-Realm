import { doc, serverTimestamp, setDoc, updateDoc, arrayUnion, addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
export async function createRoom({ Name, Createdby }) {
  console.log("create", { Name, Createdby });
    
  // Validate required fields
  if (!Name || !Createdby) {
    throw new Error("Name and Createdby are required");
  }
  
  const docRef = await addDoc(collection(db, "Rooms"), {
    Name,
    Createdby,
    Description: "", // Add default description
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    files: [],
    Users: [Createdby], // Creator is automatically added as first user
    Messages: [],
    Applicants: [],
    Tags: [], // Add default tags array
  });
  
  console.log("Room created with ID:", docRef.id, "Users:", [Createdby]);
  return docRef.id;
}
