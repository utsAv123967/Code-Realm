export interface file_objects {
  name: string;
  body: string;
  language: string;
}


export interface Room {
  id: string;
  name: string;
  language: string;
  members: number;
  owner: string;
  lastActivity: string;
  isActive: boolean;
  type: 'public' | 'private' | 'temporary';
  createdAt: Date;
  description?: string;
  tags?: string[];
}

export  interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

export interface ActivityItem {
  id: string;
  type: 'join' | 'create' | 'code' | 'message';
  roomName: string;
  user: string;
  timestamp: Date;
  description: string;
}