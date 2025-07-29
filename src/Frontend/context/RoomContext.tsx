import { createContext, useContext, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../Backend/Database/firebase";
import { userId } from "../../context/Userdetails";
import type { Room } from "../../types";

interface RoomContextType {
  // Room data
  userRooms: () => Room[];
  currentRoom: () => Room | undefined;
  loading: () => boolean;
  error: () => string | undefined;

  // Actions
  setCurrentRoom: (room: Room | undefined) => void;
  refreshRooms: () => Promise<void>;
  getRoomById: (roomId: string) => Room | undefined;
}

const RoomContext = createContext<RoomContextType>();

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};

interface RoomProviderProps {
  children: JSX.Element;
}

export const RoomProvider = (props: RoomProviderProps) => {
  const [userRooms, setUserRooms] = createSignal<Room[]>([]);
  const [currentRoom, setCurrentRoom] = createSignal<Room | undefined>(
    undefined
  );
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | undefined>(undefined);

  // Fetch all rooms where user is creator or member
  const fetchUserRooms = async () => {
    const currentUserId = userId();
    if (!currentUserId) {
      console.log("🚫 No user ID, skipping room fetch");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      console.log("🔄 Fetching rooms for user:", currentUserId);

      // Query 1: Rooms created by user
      const createdRoomsQuery = query(
        collection(db, "Rooms"),
        where("Createdby", "==", currentUserId)
      );

      // Query 2: Rooms where user is a member
      const joinedRoomsQuery = query(
        collection(db, "Rooms"),
        where("Users", "array-contains", currentUserId)
      );

      const [createdSnapshot, joinedSnapshot] = await Promise.all([
        getDocs(createdRoomsQuery),
        getDocs(joinedRoomsQuery),
      ]);

      const roomsMap = new Map<string, Room>();

      // Process created rooms
      createdSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const room: Room = {
          Applicants: data.Applicants || [],
          Createdby: data.Createdby,
          Description: data.Description || "",
          Messages: data.Messages || [],
          Name: data.Name,
          RoomId: doc.id,
          Tags: data.Tags || [],
          Users: data.Users || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          files: data.files || [],
          isActive: true,
          type: "All",
        };
        roomsMap.set(doc.id, room);
      });

      // Process joined rooms (avoid duplicates)
      joinedSnapshot.docs.forEach((doc) => {
        if (!roomsMap.has(doc.id)) {
          const data = doc.data();
          const room: Room = {
            Applicants: data.Applicants || [],
            Createdby: data.Createdby,
            Description: data.Description || "",
            Messages: data.Messages || [],
            Name: data.Name,
            RoomId: doc.id,
            Tags: data.Tags || [],
            Users: data.Users || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            files: data.files || [],
            isActive: true,
            type: "All",
          };
          roomsMap.set(doc.id, room);
        }
      });

      const rooms = Array.from(roomsMap.values());

      // Sort by most recent first
      rooms.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      setUserRooms(rooms);
      console.log("✅ Fetched rooms:", rooms.length, rooms);
    } catch (err) {
      console.error("❌ Error fetching rooms:", err);
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  // Get a specific room by ID from the cached rooms
  const getRoomById = (roomId: string): Room | undefined => {
    return userRooms().find((room) => room.RoomId === roomId);
  };

  // Fetch a specific room from Firebase if not in cache
  const fetchRoomById = async (roomId: string): Promise<Room | undefined> => {
    try {
      console.log("🔄 Fetching specific room:", roomId);
      const roomDoc = await getDoc(doc(db, "Rooms", roomId));

      if (!roomDoc.exists()) {
        return undefined;
      }

      const data = roomDoc.data();
      const room: Room = {
        Applicants: data.Applicants || [],
        Createdby: data.Createdby,
        Description: data.Description || "",
        Messages: data.Messages || [],
        Name: data.Name,
        RoomId: roomDoc.id,
        Tags: data.Tags || [],
        Users: data.Users || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        files: data.files || [],
        isActive: true,
        type: "All",
      };

      return room;
    } catch (err) {
      console.error("❌ Error fetching room by ID:", err);
      return undefined;
    }
  };

  // Set current room (for navigation to CodingRoom)
  const setCurrentRoomById = async (roomId: string) => {
    // First check if room is already cached
    let room = getRoomById(roomId);

    // If not cached, fetch from Firebase
    if (!room) {
      room = await fetchRoomById(roomId);
    }

    if (room) {
      setCurrentRoom(room);
      console.log("🎯 Set current room:", room.Name, room.RoomId);
    } else {
      console.log("❌ Room not found:", roomId);
      setError(`Room with ID ${roomId} not found`);
    }
  };

  // Refresh rooms data
  const refreshRooms = async () => {
    await fetchUserRooms();
  };

  // Load rooms on mount and when user changes
  onMount(() => {
    if (userId()) {
      fetchUserRooms();
    }
  });

  // Watch for user changes and reload rooms
  const watchUserId = () => {
    const currentUserId = userId();
    if (currentUserId && userRooms().length === 0 && !loading()) {
      fetchUserRooms();
    }
  };

  // Check user ID changes every second (simple reactive approach)
  setInterval(watchUserId, 1000);

  const contextValue: RoomContextType = {
    userRooms,
    currentRoom,
    loading,
    error,
    setCurrentRoom,
    refreshRooms,
    getRoomById,
  };

  // Add setCurrentRoomById to context for external use
  (contextValue as any).setCurrentRoomById = setCurrentRoomById;

  return (
    <RoomContext.Provider value={contextValue}>
      {props.children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
