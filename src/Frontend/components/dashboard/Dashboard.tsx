// Dashboard.tsx
import { createSignal, createMemo, For, Show, createResource } from "solid-js";
import { StatCard } from "./StatCard";
import { RoomCard } from "./RoomCard";
import { ActivityCard } from "./ActivityCard";
import { TabNav } from "./TabNav";
import { Plus } from "lucide-solid";
import { Code, Users, Zap, Clock, Search } from "lucide-solid";
import type { Room, ActivityItem } from "../../../types";
import { CreateRoomModal } from "../../modals/createRoomModal";
import { fetchAllRooms } from "../../../context/Room_available_to_join";
import { RoomApplicationCard } from "./RoomApplicationCard";

const Dashboard = () => {
  const [rooms] = createResource(fetchAllRooms); // ✅ fix
  const [activeTab, setActiveTab] = createSignal<
    "overview" | "joined" | "created" | "Join Room" | "activity"
  >("overview");
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filterType, setFilterType] = createSignal<
    "all" | "public" | "private"
  >("all");
  const [createRoomModalOpen, setCreateRoomModalOpen] = createSignal(false);

  const [joinedRooms] = createSignal<Room[]>([
    {
      id: "room1",
      name: "DSA Battle Room",
      language: "C++",
      members: 6,
      owner: "Utsav",
      lastActivity: "2 mins ago",
      isActive: true,
      type: "public",
      createdAt: new Date(),
      description: "Practice problems & contests",
      tags: ["dsa", "contest", "cpp"],
    },
    {
      id: "room2",
      name: "ML Bootcamp",
      language: "Python",
      members: 9,
      owner: "Nikita",
      lastActivity: "10 mins ago",
      isActive: false,
      type: "private",
      createdAt: new Date(),
      description: "End-to-end ML project discussion",
      tags: ["ml", "project", "python"],
    },
  ]);

  const [createdRooms] = createSignal<Room[]>([
    {
      id: "room3",
      name: "Web Security",
      language: "JavaScript",
      members: 5,
      owner: "You",
      lastActivity: "1 hour ago",
      isActive: true,
      type: "public",
      createdAt: new Date(),
      description: "Ethical hacking and vulnerabilities",
      tags: ["web", "security", "js"],
    },
  ]);

  const [Join_room] = createSignal<Room[]>([]);
  const [recentActivity] = createSignal<ActivityItem[]>([]);

  const totalRooms = createMemo(
    () => joinedRooms().length + createdRooms().length + Join_room().length
  ); // ✅ fixed Join_room().length

  const activeRooms = createMemo(
    () =>
      [...joinedRooms(), ...createdRooms(), ...Join_room()].filter(
        (room) => room.isActive
      ).length
  );

  const totalMembers = createMemo(() =>
    [...joinedRooms(), ...createdRooms(), ...Join_room()].reduce(
      (sum, room) => sum + room.members,
      0
    )
  );

  const filteredRooms = createMemo(() => {
    const allRooms = [...joinedRooms(), ...createdRooms(), ...Join_room()];
    const term = searchTerm().toLowerCase();
    const type = filterType();
    return allRooms.filter((room) => {
      const matchesSearch = room.name.toLowerCase().includes(term);
      const matchesType = type === "all" || room.type === type;
      return matchesSearch && matchesType;
    });
  });

  return (
    <div class='min-h-screen bg-gray-50 p-6'>
      <TabNav activeTab={activeTab()} setActiveTab={setActiveTab} />

      <Show when={activeTab() === "overview"}>
        <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6'>
          <StatCard
            title='Total Rooms'
            value={totalRooms()}
            icon={<Code size={20} />}
            color='bg-blue-100 text-blue-600'
          />
          <StatCard
            title='Active Rooms'
            value={activeRooms()}
            icon={<Zap size={20} />}
            color='bg-green-100 text-green-600'
          />
          <StatCard
            title='Total Members'
            value={totalMembers()}
            icon={<Users size={20} />}
            color='bg-purple-100 text-purple-600'
          />
          <StatCard
            title='Temporary Rooms'
            value={Join_room().length}
            icon={<Clock size={20} />}
            color='bg-orange-100 text-orange-600'
          />
        </div>

        <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          <div class='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
            <h3 class='font-semibold text-gray-900 mb-4'>Quick Actions</h3>
            <div class='space-y-3'>
              <button
                class='w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors'
                onClick={() => setCreateRoomModalOpen(true)}>
                <Plus size={16} />
                Create New Room
              </button>
              <button class='w-full flex items-center gap-3 p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors'>
                <Users size={16} />
                Browse Public Rooms
              </button>
              <button class='w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors'>
                <Clock size={16} />
                Join a Room
              </button>
            </div>
          </div>
        </div>
      </Show>

      <Show when={createRoomModalOpen()}>
        <CreateRoomModal
          isOpen={createRoomModalOpen()}
          onClose={() => setCreateRoomModalOpen(false)}
        />
      </Show>

      <Show when={["joined", "created"].includes(activeTab())}>
        <div class='flex gap-4 mb-4'>
          <div class='relative flex-1'>
            <Search
              size={20}
              class='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            />
            <input
              type='text'
              placeholder='Search rooms...'
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.target.value)}
              class='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <select
            value={filterType()}
            onChange={(e) => setFilterType(e.target.value as any)}
            class='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
            <option value='all'>All Types</option>
            <option value='public'>Public</option>
            <option value='private'>Private</option>
          </select>
        </div>

        <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <For
            each={filteredRooms().filter((room) => {
              if (activeTab() === "joined") return joinedRooms().includes(room);
              if (activeTab() === "created")
                return createdRooms().includes(room);
              return false;
            })}>
            {(room) => (
              <RoomCard room={room} showActions={activeTab() === "created"} />
            )}
          </For>
        </div>
      </Show>

      <Show when={activeTab() === "Join Room"}>
        <Show
          when={!rooms.loading && rooms()}
          fallback={<p class='text-gray-500 text-sm'>Loading rooms...</p>}>
          <div class='flex flex-wrap gap-4 p-4 justify-start'>
            <For each={rooms()}>
              {(room) => (
                <div class='w-full sm:w-[48%] lg:w-[31%]'>
                  <RoomApplicationCard
                    room={room}
                    onApply={(roomId) =>
                      console.log("Apply requested for room:", roomId)
                    }
                  />
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>

      <Show when={activeTab() === "activity"}>
        <div class='bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200'>
          <For each={recentActivity()}>
            {(activity) => <ActivityCard activity={activity} />}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default Dashboard;
