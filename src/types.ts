export interface file_objects {
  name: string;
  body: string;
  language: string;
  fileId?: string; 
  lastChanged?: Date;
  roomId?: string;
  hasUnsavedChanges?: boolean; 
}

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
  Messages:object[];        
  Name: string;                        
  RoomId: string;                      
  Tags?: string[];                     
  Users?: string[];   
  createdAt:Date,
  updatedAt:Date,                 
  files?: string[];      
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