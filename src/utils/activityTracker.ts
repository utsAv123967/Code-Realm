import type { ActivityItem } from "../types";
import { getCurrentUser } from "../context/Userdetails";

// Activity tracking service
export class ActivityTracker {
  private static activities: ActivityItem[] = [];

  // Add a new activity
  static addActivity(activity: Omit<ActivityItem, 'id' | 'timestamp' | 'user'>) {
    const currentUser = getCurrentUser();
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      user: currentUser?.displayName || currentUser?.email || 'Unknown User'
    };

    this.activities.unshift(newActivity);
    
    // Keep only last 50 activities
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }

    // Store in localStorage for persistence
    localStorage.setItem('codeRealm_activities', JSON.stringify(this.activities));
    
    return newActivity;
  }

  // Get recent activities for current user
  static getRecentActivities(limit: number = 10): ActivityItem[] {
    // Load from localStorage on first call
    if (this.activities.length === 0) {
      const stored = localStorage.getItem('codeRealm_activities');
      if (stored) {
        try {
          this.activities = JSON.parse(stored).map((a: any) => ({
            ...a,
            timestamp: new Date(a.timestamp)
          }));
        } catch (e) {
          console.warn('Could not parse stored activities');
        }
      }
    }

    return this.activities.slice(0, limit);
  }

  // Clear all activities
  static clearActivities() {
    this.activities = [];
    localStorage.removeItem('codeRealm_activities');
  }

  // Track room creation
  static trackRoomCreation(roomName: string, tags?: string[]) {
    return this.addActivity({
      type: 'create',
      roomName,
      description: 'created a new room',
      metadata: { tags }
    });
  }

  // Track room joining
  static trackRoomJoin(roomName: string) {
    return this.addActivity({
      type: 'join',
      roomName,
      description: 'joined the room'
    });
  }

  // Track code editing
  static trackCodeEdit(roomName: string, fileName: string, language: string, lineCount?: number) {
    return this.addActivity({
      type: 'edit',
      roomName,
      description: `edited code in ${fileName}`,
      metadata: { fileName, language, lineCount }
    });
  }

  // Track file creation
  static trackFileCreation(roomName: string, fileName: string, language: string) {
    return this.addActivity({
      type: 'file',
      roomName,
      description: `created a new file`,
      metadata: { fileName, language }
    });
  }

  // Track message sending
  static trackMessage(roomName: string) {
    return this.addActivity({
      type: 'message',
      roomName,
      description: 'sent a message'
    });
  }

  // Track help request
  static trackHelpRequest(roomName: string) {
    return this.addActivity({
      type: 'help',
      roomName,
      description: 'asked for help'
    });
  }

  // Track code sharing
  static trackCodeShare(roomName: string, fileName?: string) {
    return this.addActivity({
      type: 'share',
      roomName,
      description: 'shared code solution',
      metadata: { fileName }
    });
  }
}

// Generate sample activities for demo purposes
export function generateSampleActivities(): ActivityItem[] {
  const currentUser = getCurrentUser();
  const userName = currentUser?.displayName || 'You';
  const now = new Date();

  return [
    {
      id: 'sample_1',
      type: 'create',
      roomName: 'React Masterclass',
      user: userName,
      description: 'created a new room',
      timestamp: new Date(now.getTime() - 30 * 60000), // 30 mins ago
      metadata: { tags: ['React', 'JavaScript', 'Frontend'] }
    },
    {
      id: 'sample_2',
      type: 'file',
      roomName: 'Python Bootcamp',
      user: userName,
      description: 'created a new file',
      timestamp: new Date(now.getTime() - 2 * 60 * 60000), // 2 hours ago
      metadata: { fileName: 'main.py', language: 'Python', lineCount: 45 }
    },
    {
      id: 'sample_3',
      type: 'join',
      roomName: 'JS Deep Dive',
      user: userName,
      description: 'joined the room',
      timestamp: new Date(now.getTime() - 5 * 60 * 60000), // 5 hours ago
    },
    {
      id: 'sample_4',
      type: 'edit',
      roomName: 'TypeScript Workshop',
      user: userName,
      description: 'edited code in components.tsx',
      timestamp: new Date(now.getTime() - 24 * 60 * 60000), // 1 day ago
      metadata: { fileName: 'components.tsx', language: 'TypeScript', lineCount: 120 }
    },
    {
      id: 'sample_5',
      type: 'message',
      roomName: 'Algorithm Study',
      user: userName,
      description: 'sent a message',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60000), // 2 days ago
    },
    {
      id: 'sample_6',
      type: 'help',
      roomName: 'Data Structures',
      user: userName,
      description: 'asked for help',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60000), // 3 days ago
    },
    {
      id: 'sample_7',
      type: 'share',
      roomName: 'Web Development',
      user: userName,
      description: 'shared code solution',
      timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60000), // 4 days ago
      metadata: { fileName: 'solution.js' }
    }
  ];
}
