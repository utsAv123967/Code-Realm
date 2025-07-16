import { createRoom } from "../Backend/Database/Create_Room";
import { fetchAllRooms } from "../context/Room_available_to_join";
import uuid from "uuid";
export default function Test() {
  const testing = async () => {
    fetchAllRooms();
  };
  return (
    <div>
      <button
        class='bg-blue-500 text-white px-4 py-2 rounded'
        onclick={testing}>
        test it
      </button>
    </div>
  );
}
