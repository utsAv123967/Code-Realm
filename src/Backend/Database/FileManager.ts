import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Create_File_Data } from "./Create_file_data";
import type { DatabaseFile } from "../../types";
import { Update_File } from "./Update_File";
export const createFile = async (
  roomId: string, 
  fileName: string, 
  code: string, 
  language: string, 
  createdBy: string
) => {
  try {

    const file = await Create_File_Data({
      fileName,
      code,
      roomId,
      language,
      createdBy
    });

    const roomRef = doc(db, "Rooms", roomId);
    await updateDoc(roomRef, {
      files: arrayUnion(file.fileId),
      updatedAt: new Date()
    });
    return { 
      success: true, 
      fileId: file.fileId,
      file: { ...file.fileData, fileId: file.fileId } as DatabaseFile
    };
  } catch (error) {
    console.error("❌ Error creating file:", error);
    return { success: false, error };
  }
};


export const updateFileContent = async (fileId: string, code: string) => {
  try {
    const result = await Update_File(fileId, code);
    if (result && result.success) {
      return result;
    }
    return { success: false, error: "Failed to update file" };
  } catch (error) {
    return { success: false, error: (error as Error).message ?? error };
  }
};


export const loadRoomFiles = async (roomId: string): Promise<DatabaseFile[]> => {
  try {
    const filesQuery = query(
      collection(db, "Files"),
      where("roomId", "==", roomId)
    );

    const snapshot = await getDocs(filesQuery);
    const files: DatabaseFile[] = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      files.push({
        fileId: doc.id,
        name: data.name,
        code: data.code,
        lastChanged: data.lastChanged?.toDate() || new Date(),
        roomId: data.roomId,
        language: data.language,
        createdBy: data.createdBy
      });
    });

    return files;
  } catch (error) {
    console.error("❌ Error loading room files:", error);
    return [];
  }
};

export const loadFilesByIds = async (fileIds: string[]): Promise<DatabaseFile[]> => {
  try {
    if (!fileIds || fileIds.length === 0) {
      return [];
    }

    const files: DatabaseFile[] = [];
    
    
    const promises = fileIds.map(async (fileId) => {
      try {
        const fileRef = doc(db, "Files", fileId);
        const fileSnap = await getDoc(fileRef);
        
        if (fileSnap.exists()) {
          const data = fileSnap.data();
          return {
            fileId: fileSnap.id,
            name: data.name,
            code: data.code,
            lastChanged: data.lastChanged?.toDate() || new Date(),
            roomId: data.roomId,
            language: data.language,
            createdBy: data.createdBy
          } as DatabaseFile;
        }
        return null;
      } catch (error) {
        console.error(`❌ Error loading file ${fileId}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    
    
    results.forEach(file => {
      if (file) files.push(file);
    });

    
    return files;
  } catch (error) {
    console.error("❌ Error loading files by IDs:", error);
    return [];
  }
};

export const deleteFile = async (fileId: string, roomId: string) => {
  try {
    
    const fileRef = doc(db, "Files", fileId);
    await deleteDoc(fileRef);
    
    const roomRef = doc(db, "Rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (roomSnap.exists()) {
      const roomData = roomSnap.data();
      const updatedFiles = (roomData.files || []).filter((id: string) => id !== fileId);
      
      await updateDoc(roomRef, {
        files: updatedFiles,
        updatedAt: new Date()
      });
    }
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return { success: false, error };
  }
};
