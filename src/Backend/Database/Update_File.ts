import { 
  doc, 
  updateDoc, 
} from "firebase/firestore";
import { db } from "./firebase";
export const Update_File=async(fileId: string, code: string)=>{
const fileRef = doc(db, "Files", fileId);
    await updateDoc(fileRef, {
      code: code,
      lastChanged: new Date()
    });

    return { success: true };
}