export interface file_objects {
  name: string;
  body: string;
  language: string;
  fileId?: string; // Optional for local files
  lastChanged?: Date;
  roomId?: string;
  hasUnsavedChanges?: boolean; // Track unsaved changes
}

// New interface for database file storage
export interface DatabaseFile {
  fileId: string;
  name: string;
  code: string;
  lastChanged: Date;
  roomId: string;
  language: string;
  createdBy: string;
}

export type RoomType = "All" | "Protected";
export interface Room {
  Applicants?:  object[];  
  Createdby: string; 
  Description: string;  
  Messages:object[];        // Applicants (optional)                        // doc.id
  Name: string;                        // Messages.Name
  RoomId: string;                      // updatedAt (Firestore Timestamp)
  Tags?: string[];                     // Tags (optional)
  Users?: string[];   
  createdAt:Date,
  updatedAt:Date,                 // Users (optional)
  files?: string[];      // Array of file IDs instead of filenames
  isActive:boolean;
  type: RoomType;
}


export interface ActivityItem {
  id: string;
  type: 'join' | 'create' | 'code' | 'message' | 'leave' | 'file' | 'comment' | 'invite' | 'help' | 'share' | 'edit';
  roomName: string;
  user: string;
  timestamp: Date;
  description: string;
  metadata?: {
    fileName?: string;
    language?: string;
    lineCount?: number;
    collaborators?: string[];
    tags?: string[];
  };
}