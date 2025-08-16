
import type { DatabaseFile } from "../../types";
import { 
  addDoc, 
  collection, 
} from "firebase/firestore";
import { db } from "./firebase";
export const Create_File_Data=async({fileName,code,roomId,language,createdBy}:{
    fileName: string;
    code: string;
    roomId: string;
    language: string;
    createdBy: string;
})=>{
    
const fileData: Omit<DatabaseFile, 'fileId'> = {
      name: fileName,
      code: code,
      lastChanged: new Date(),
      roomId: roomId,
      language: language,
      createdBy: createdBy
    };

    const fileRef = await addDoc(collection(db, "Files"), fileData);
    const fileId = fileRef.id;
    return {fileId,fileData};

}