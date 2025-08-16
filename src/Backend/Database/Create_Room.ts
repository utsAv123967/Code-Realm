import { serverTimestamp,  addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
export async function createRoom({ Name, Createdby }: {
  Name: string;
  Createdby: string;
}) {
    
  if (!Name || !Createdby) {
    throw new Error("Name and Createdby are required");
  }
  
  const docRef = await addDoc(collection(db, "Rooms"), {
    Name,
    Createdby,
    Description: "", 
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    files: [],
    Users: [Createdby], 
    Messages: [],
    Applicants: [],
    Tags: [], 
  });
  
  return docRef.id;
}
