import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";
import type { DatabaseFile } from "../../types";


export const createFile = async (
  roomId: string, 
  fileName: string, 
  code: string, 
  language: string, 
  createdBy: string
) => {
  try {
    console.log("📁 Creating new file:", { roomId, fileName, language });

    // Create file document in Files collection
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

    console.log("✅ File created with ID:", fileId);

    // Add file ID to room's files array
    const roomRef = doc(db, "Rooms", roomId);
    await updateDoc(roomRef, {
      files: arrayUnion(fileId),
      updatedAt: new Date()
    });

    console.log("✅ File ID added to room");

    return { 
      success: true, 
      fileId,
      file: { ...fileData, fileId } as DatabaseFile
    };
  } catch (error) {
    console.error("❌ Error creating file:", error);
    return { success: false, error };
  }
};


export const updateFileContent = async (fileId: string, code: string) => {
  try {
    console.log("💾 Updating file content:", fileId);

    const fileRef = doc(db, "Files", fileId);
    await updateDoc(fileRef, {
      code: code,
      lastChanged: new Date()
    });

    console.log("✅ File content updated");
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating file:", error);
    return { success: false, error };
  }
};


export const loadRoomFiles = async (roomId: string): Promise<DatabaseFile[]> => {
  try {
    console.log("🔍 Loading files for room:", roomId);

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

    console.log(`✅ Loaded ${files.length} files for room`);
    return files;
  } catch (error) {
    console.error("❌ Error loading room files:", error);
    return [];
  }
};

export const loadFilesByIds = async (fileIds: string[]): Promise<DatabaseFile[]> => {
  try {
    console.log("🔍 Loading files by IDs:", fileIds);

    if (!fileIds || fileIds.length === 0) {
      return [];
    }

    const files: DatabaseFile[] = [];
    
    // Load each file individually (Firestore doesn't support array-contains-any for document IDs)
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
    
    // Filter out null results
    results.forEach(file => {
      if (file) files.push(file);
    });

    console.log(`✅ Loaded ${files.length} files from ${fileIds.length} IDs`);
    return files;
  } catch (error) {
    console.error("❌ Error loading files by IDs:", error);
    return [];
  }
};

export const deleteFile = async (fileId: string, roomId: string) => {
  try {
    console.log("🗑️ Deleting file:", fileId);

    // Remove file from Files collection
    const fileRef = doc(db, "Files", fileId);
    await setDoc(fileRef, {}, { merge: false }); // This effectively deletes the document

    // Remove file ID from room's files array
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

    console.log("✅ File deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return { success: false, error };
  }
};
