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
  availableRooms: () => Room[];
  availableRoomsLoading: () => boolean;

  // Actions
  setCurrentRoom: (room: Room | undefined) => void;
  refreshRooms: () => Promise<void>;
  getRoomById: (roomId: string) => Room | undefined;
  fetchAvailableRooms: () => Promise<void>;
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
  const [availableRooms, setAvailableRooms] = createSignal<Room[]>([]);
  const [availableRoomsLoading, setAvailableRoomsLoading] = createSignal(false);

  // Fetch all rooms where user is creator or member
  const fetchUserRooms = async () => {
    const currentUserId = userId();
    if (!currentUserId) {
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
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
    } catch (err) {
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
    } else {
      setError(`Room with ID ${roomId} not found`);
    }
  };

  // Refresh rooms data
  const refreshRooms = async () => {
    await fetchUserRooms();
  };

  // Fetch all available rooms (rooms the user hasn't joined yet)
  const fetchAvailableRooms = async () => {
    const currentUserId = userId();
    if (!currentUserId) {
      return;
    }

    setAvailableRoomsLoading(true);
    setError(undefined);

    try {
      // Fetch all rooms from the database
      const allRoomsQuery = collection(db, "Rooms");
      const allRoomsSnapshot = await getDocs(allRoomsQuery);

      if (allRoomsSnapshot.docs.length === 0) {
        setAvailableRooms([]);
        return;
      }

      const allRooms: Room[] = [];
      allRoomsSnapshot.docs.forEach((doc) => {
        try {
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
          allRooms.push(room);
        } catch (roomError) {
          console.error(`❌ Error processing room ${doc.id}:`, roomError);
        }
      });

      // Filter out rooms the user has already joined or created
      const roomsToJoin = allRooms.filter((room) => {
        // Exclude rooms created by the user
        if (room.Createdby === currentUserId) {
          return false;
        }

        // Exclude rooms where user is already a member
        if (room.Users && room.Users.includes(currentUserId)) {
          return false;
        }

        // Exclude rooms where user has already applied (if Applicants contains user objects)
        if (room.Applicants && room.Applicants.length > 0) {
          const hasApplied = room.Applicants.some((applicant: any) =>
            typeof applicant === "string"
              ? applicant === currentUserId
              : applicant.userId === currentUserId
          );
          if (hasApplied) {
            return false;
          }
        }

        return true;
      });

      // Sort by most recent first
      roomsToJoin.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      setAvailableRooms(roomsToJoin);
    } catch (err) {
      console.error("❌ Error fetching available rooms:", err);
      setError("Failed to load available rooms: " + (err as Error).message);
    } finally {
      setAvailableRoomsLoading(false);
    }
  };

  // Load rooms on mount and when user changes
  onMount(() => {
    const checkAndLoadRooms = () => {
      const currentUserId = userId();
      if (currentUserId) {
        fetchUserRooms();
        fetchAvailableRooms();
      } else {
        // Retry after a short delay
        setTimeout(checkAndLoadRooms, 500);
      }
    };
    checkAndLoadRooms();
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
    availableRooms,
    availableRoomsLoading,
    setCurrentRoom,
    refreshRooms,
    getRoomById,
    fetchAvailableRooms,
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
