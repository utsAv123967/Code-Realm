import { createSignal } from "solid-js";
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  serverTimestamp,
  where,
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "../../Backend/Database/firebase";

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'join' | 'leave' | 'typing';
}

export interface TypingUser {
  userId: string;
  username: string;
  timestamp: Date;
}

class FirebaseChatService {
  // Signals for reactive state
  private isConnectedSignal = createSignal(true); // Firebase is always "connected"
  private messagesSignal = createSignal<ChatMessage[]>([]);
  private typingUsersSignal = createSignal<string[]>([]);
  
  // Store unsubscribe functions for cleanup
  private unsubscribeMessages: (() => void) | null = null;
  private currentRoomId: string | null = null;

  constructor() {
    console.log("🔥 Firebase Chat Service initialized");
  }

  // Send a message to a room
  public async sendMessage(roomId: string, userId: string, username: string, content: string): Promise<void> {
    try {
      await addDoc(collection(db, "ChatMessages"), {
        roomId,
        sender: userId,
        senderName: username,
        content,
        timestamp: serverTimestamp(),
        type: 'message'
      });
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  }

  // Send typing indicator
  public async sendTyping(_roomId: string, _userId: string, username: string, isTyping: boolean): Promise<void> {
    // For typing indicators, we can use a simpler local approach since they're temporary
    if (isTyping) {
      this.typingUsersSignal[1](prev => [...prev.filter(u => u !== username), username]);
    } else {
      this.typingUsersSignal[1](prev => prev.filter(u => u !== username));
    }
  }

  // Join a room and start listening for messages
  public joinRoom(roomId: string, userId: string, _username: string): void {
    // If we're already in a room, leave it first
    if (this.currentRoomId && this.currentRoomId !== roomId) {
      this.leaveRoom(this.currentRoomId, userId);
    }
    
    this.currentRoomId = roomId;
    
    // Start listening for messages in this room (no join message)
    this.listenForMessages(roomId);
  }

  // Leave a room
  public leaveRoom(roomId: string, _userId: string): void {
    console.log(`🚪 Leaving room ${roomId}`);
    
    // Clean up message listener
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
      this.unsubscribeMessages = null;
    }
    
    // Clear current room
    this.currentRoomId = null;
    
    // Clear messages and typing users
    this.messagesSignal[1]([]);
    this.typingUsersSignal[1]([]);
  }

  // Listen for messages in a room
  private listenForMessages(roomId: string): void {
    const messagesRef = collection(db, "ChatMessages");
    
    // Query for recent messages (last 100 messages in the room)
    // Using limit to avoid fetching too many old messages
    const q = query(
      messagesRef,
      where("roomId", "==", roomId),
      limit(100) // Store last 100 messages for better performance
    );

    this.unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only include regular messages, skip join/leave messages
        if (data.type === 'message' || !data.type) {
          const message: ChatMessage = {
            id: doc.id,
            roomId: data.roomId,
            sender: data.sender,
            senderName: data.senderName,
            content: data.content,
            timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
            type: 'message'
          };
          messages.push(message);
        }
      });

      // Sort messages by timestamp (newest messages last)
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Update messages signal - this triggers real-time updates
      this.messagesSignal[1](messages);
    }, (error) => {
      console.error("❌ Error listening for messages:", error);
    });
  }

  // Disconnect (cleanup)
  public disconnect(): void {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
      this.unsubscribeMessages = null;
    }
    
    this.currentRoomId = null;
    this.messagesSignal[1]([]);
    this.typingUsersSignal[1]([]);
  }

  // Getters for reactive state
  public getIsConnected = () => this.isConnectedSignal[0]();
  public getMessages = () => this.messagesSignal[0]();
  public getTypingUsers = () => this.typingUsersSignal[0]();
  public clearMessages = () => this.messagesSignal[1]([]);
}

// Export singleton instance
export const chatWebSocket = new FirebaseChatService();
