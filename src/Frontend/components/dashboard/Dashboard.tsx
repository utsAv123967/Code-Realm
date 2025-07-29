// Dashboard.tsx
import { createSignal, createMemo, For, Show } from "solid-js";
import { StatCard } from "./StatCard";
import { RoomCard } from "./RoomCard";
import { ActivityCard } from "./ActivityCard";
import { TabNav } from "./TabNav";
import { Plus } from "lucide-solid";
import {
  Code,
  Users,
  Zap,
  Clock,
  Search,
  User,
  Mail,
  Calendar,
  Settings,
  Activity,
} from "lucide-solid";
import type { ActivityItem } from "../../../types";
import { CreateRoomModal } from "../../modals/createRoomModal";
import { RoomApplicationCard } from "./RoomApplicationCard";
import { userId, getCurrentUser } from "../../../context/Userdetails";
import { applyToRoom } from "../../../Backend/Database/Apply_to_room";
import {
  ActivityTracker,
  generateSampleActivities,
} from "../../../utils/activityTracker";
import { useRoomContext } from "../../context/RoomContext";
const Dashboard = () => {
  // Debug: Log user authentication status
  console.log("Dashboard loaded - User ID:", userId());
  console.log("Dashboard loaded - Current User:", getCurrentUser());

  // Use room context instead of direct API calls
  const roomContext = useRoomContext();

  const [activeTab, setActiveTab] = createSignal<
    "overview" | "joined" | "created" | "Join Room" | "activity"
  >("overview");
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filterType, setFilterType] = createSignal<
    "all" | "public" | "private"
  >("all");
  const [createRoomModalOpen, setCreateRoomModalOpen] = createSignal(false);

  // Handle joining a room
  const handleJoinRoom = async (roomId: string) => {
    const currentUserId = userId();
    if (!currentUserId) {
      console.error("User not authenticated");
      return;
    }

    try {
      console.log("🔄 Joining room:", roomId);
      await applyToRoom(roomId, currentUserId);
      console.log("✅ Successfully joined room!");

      // Track the activity
      const room = roomContext.userRooms().find((r) => r.RoomId === roomId);
      if (room) {
        ActivityTracker.trackRoomJoin(room.Name);
        loadActivities(); // Refresh activities
      }

      // Refresh the room data to update the UI
      await roomContext.refreshRooms();
    } catch (error) {
      console.error("❌ Failed to join room:", error);
    }
  };

  // Get rooms categorized by user relationship
  const createdRooms = createMemo(() => {
    const currentUserId = userId();
    if (!currentUserId) return [];
    return roomContext
      .userRooms()
      .filter((room) => room.Createdby === currentUserId);
  });

  const joinedRooms = createMemo(() => {
    const currentUserId = userId();
    if (!currentUserId) return [];
    return roomContext
      .userRooms()
      .filter(
        (room) =>
          room.Users &&
          room.Users.includes(currentUserId) &&
          room.Createdby !== currentUserId
      );
  });

  const availableRooms = createMemo(() => {
    const currentUserId = userId();
    if (!currentUserId) return [];
    // For now, we'll show all user rooms as available
    return roomContext.userRooms();
  });

  const [recentActivity, setRecentActivity] = createSignal<ActivityItem[]>([]);

  // Load activities on component mount
  const loadActivities = () => {
    const activities = ActivityTracker.getRecentActivities(15);
    if (activities.length === 0) {
      // If no activities, show sample data
      setRecentActivity(generateSampleActivities());
    } else {
      setRecentActivity(activities);
    }
  };

  const totalRooms = createMemo(
    () => joinedRooms().length + createdRooms().length + availableRooms().length
  );

  const activeRooms = createMemo(
    () => joinedRooms().length + createdRooms().length + availableRooms().length // All rooms are considered active since Room type doesn't have isActive
  );

  const totalMembers = createMemo(
    () =>
      [...joinedRooms(), ...createdRooms()].reduce(
        (sum, room) => sum + (room.Users?.length || 0),
        0
      ) -
      joinedRooms().length -
      createdRooms().length +
      1
  );

  const filteredRooms = createMemo(() => {
    const allRooms = [...joinedRooms(), ...createdRooms()];
    const term = searchTerm().toLowerCase();
    // Remove type filtering since Room type doesn't have a type property
    return allRooms.filter((room) => {
      const matchesSearch = room.Name.toLowerCase().includes(term);
      return matchesSearch;
    });
  });

  const handleCreateRoom = (roomName: string, tags?: string[]) => {
    // Track room creation activity
    ActivityTracker.trackRoomCreation(roomName, tags);
    loadActivities(); // Refresh activities
    roomContext.refreshRooms(); // Refresh room data
  };

  // Load activities on component mount
  setTimeout(() => loadActivities(), 100);

  return (
    <div class='min-h-screen bg-gray-50'>
      {/* Header Section with User Profile */}
      <div class='bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200'>
        <div class='max-w-7xl mx-auto px-6 py-8'>
          <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
            {/* User Profile Section */}
            <div class='flex items-center gap-4'>
              <div class='w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg'>
                {getCurrentUser()?.displayName?.charAt(0) ||
                  getCurrentUser()?.email?.charAt(0) ||
                  "U"}
              </div>
              <div>
                <h1 class='text-2xl font-bold text-gray-900'>
                  Welcome back, {getCurrentUser()?.displayName || "Developer"}!
                </h1>
                <div class='flex items-center gap-4 mt-2 text-sm text-gray-600'>
                  <div class='flex items-center gap-1'>
                    <Mail size={14} />
                    <span>{getCurrentUser()?.email || "No email"}</span>
                  </div>
                  <div class='flex items-center gap-1'>
                    <Calendar size={14} />
                    <span>Joined {new Date().toLocaleDateString()}</span>
                  </div>
                  <div class='flex items-center gap-1'>
                    <User size={14} />
                    <span class='font-mono text-xs'>
                      ID: {userId()?.slice(0, 8) || "No ID"}...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div class='flex gap-6'>
              <div class='text-center'>
                <div class='text-2xl font-bold text-blue-600'>
                  {totalRooms()}
                </div>
                <div class='text-sm text-gray-600'>Total Rooms</div>
              </div>
              <div class='text-center'>
                <div class='text-2xl font-bold text-green-600'>
                  {activeRooms()}
                </div>
                <div class='text-sm text-gray-600'>Active</div>
              </div>
              <div class='text-center'>
                <div class='text-2xl font-bold text-purple-600'>
                  {totalMembers()}
                </div>
                <div class='text-sm text-gray-600'>Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class='max-w-7xl mx-auto p-6'>
        <TabNav activeTab={activeTab()} setActiveTab={setActiveTab} />
        <Show when={activeTab() === "overview"}>
          {/* Enhanced Stats Grid */}
          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>
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
          </div>

          {/* Quick Actions and Recent Activity Grid */}
          <div class='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'>
            {/* Quick Actions Card */}
            <div class='bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200'>
              <div class='flex items-center gap-3 mb-6'>
                <div class='p-2 bg-blue-50 rounded-lg'>
                  <Plus size={20} class='text-blue-600' />
                </div>
                <h3 class='text-xl font-semibold text-gray-900'>
                  Quick Actions
                </h3>
              </div>
              <div class='space-y-4'>
                <button
                  class='w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group'
                  onClick={() => setCreateRoomModalOpen(true)}>
                  <div class='p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors'>
                    <Plus size={18} />
                  </div>
                  <div class='text-left'>
                    <div class='font-medium'>Create New Room</div>
                    <div class='text-sm text-blue-600'>
                      Start a new coding session
                    </div>
                  </div>
                </button>
                <button
                  class='w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 group'
                  onClick={() => setActiveTab("Join Room")}>
                  <div class='p-2 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors'>
                    <Users size={18} />
                  </div>
                  <div class='text-left'>
                    <div class='font-medium'>Browse Public Rooms</div>
                    <div class='text-sm text-green-600'>
                      Join existing sessions
                    </div>
                  </div>
                </button>
                <button
                  class='w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group'
                  onClick={() => setActiveTab("activity")}>
                  <div class='p-2 bg-purple-200 rounded-lg group-hover:bg-purple-300 transition-colors'>
                    <Clock size={18} />
                  </div>
                  <div class='text-left'>
                    <div class='font-medium'>View Activity</div>
                    <div class='text-sm text-purple-600'>
                      Check recent updates
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* User Profile Summary Card */}
            <div class='bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200'>
              <div class='flex items-center gap-3 mb-6'>
                <div class='p-2 bg-gray-50 rounded-lg'>
                  <User size={20} class='text-gray-600' />
                </div>
                <h3 class='text-xl font-semibold text-gray-900'>
                  Profile Summary
                </h3>
              </div>
              <div class='space-y-4'>
                <div class='flex items-center justify-between p-4 bg-gray-50 rounded-xl'>
                  <div class='flex items-center gap-3'>
                    <div class='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm'>
                      {getCurrentUser()?.displayName?.charAt(0) ||
                        getCurrentUser()?.email?.charAt(0) ||
                        "U"}
                    </div>
                    <div>
                      <div class='font-medium text-gray-900'>
                        {getCurrentUser()?.displayName || "Anonymous User"}
                      </div>
                      <div class='text-sm text-gray-600'>
                        {getCurrentUser()?.email}
                      </div>
                    </div>
                  </div>
                  <button class='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                    <Settings size={16} />
                  </button>
                </div>

                <div class='grid grid-cols-2 gap-4'>
                  <div class='text-center p-4 bg-blue-50 rounded-xl'>
                    <div class='text-lg font-semibold text-blue-600'>
                      {joinedRooms().length}
                    </div>
                    <div class='text-sm text-gray-600'>Joined Rooms</div>
                  </div>
                  <div class='text-center p-4 bg-green-50 rounded-xl'>
                    <div class='text-lg font-semibold text-green-600'>
                      {createdRooms().length}
                    </div>
                    <div class='text-sm text-gray-600'>Created Rooms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>{" "}
        <Show when={createRoomModalOpen()}>
          <CreateRoomModal
            isOpen={createRoomModalOpen()}
            onClose={() => setCreateRoomModalOpen(false)}
            onRoomCreated={() => {
              console.log("Room created, refreshing dashboard data...");
              loadActivities(); // Refresh activities
              roomContext.refreshRooms();
            }}
          />
        </Show>
        <Show when={["joined", "created"].includes(activeTab())}>
          {/* Enhanced Search and Filter Section */}
          <div class='bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8'>
            <div class='flex flex-col md:flex-row gap-4'>
              <div class='relative flex-1'>
                <Search
                  size={20}
                  class='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
                />
                <input
                  type='text'
                  placeholder='Search your rooms...'
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.target.value)}
                  class='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200'
                />
              </div>
              <select
                value={filterType()}
                onChange={(e) => setFilterType(e.target.value as any)}
                class='px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 min-w-[140px]'>
                <option value='all'>All Types</option>
                <option value='public'>Public</option>
                <option value='private'>Private</option>
              </select>
            </div>
          </div>

          {/* Rooms Grid with Better Spacing */}
          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <For
              each={filteredRooms().filter((room) => {
                if (activeTab() === "joined")
                  return joinedRooms().includes(room);
                if (activeTab() === "created")
                  return createdRooms().includes(room);
                return false;
              })}>
              {(room) => (
                <RoomCard
                  room={room}
                  onApply={(roomId) => console.log("Apply to room:", roomId)}
                />
              )}
            </For>
          </div>

          {/* Empty State */}
          <Show
            when={
              filteredRooms().filter((room) => {
                if (activeTab() === "joined")
                  return joinedRooms().includes(room);
                if (activeTab() === "created")
                  return createdRooms().includes(room);
                return false;
              }).length === 0
            }>
            <div class='text-center py-16'>
              <div class='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Code size={32} class='text-gray-400' />
              </div>
              <h3 class='text-lg font-medium text-gray-900 mb-2'>
                {activeTab() === "joined"
                  ? "No joined rooms yet"
                  : "No created rooms yet"}
              </h3>
              <p class='text-gray-600 mb-6'>
                {activeTab() === "joined"
                  ? "Start by joining a public room or creating your own coding session"
                  : "Create your first room to start collaborating with others"}
              </p>
              <button
                onClick={() => setCreateRoomModalOpen(true)}
                class='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200'>
                <Plus size={18} />
                Create New Room
              </button>
            </div>
          </Show>
        </Show>
        <Show when={activeTab() === "Join Room"}>
          <div class='mb-8'>
            <div class='text-center mb-8'>
              <h2 class='text-2xl font-bold text-gray-900 mb-2'>
                Discover Coding Rooms
              </h2>
              <p class='text-gray-600'>
                Join public rooms and start collaborating with developers
                worldwide
              </p>
            </div>
          </div>

          <Show
            when={!roomContext.loading() && roomContext.userRooms().length >= 0}
            fallback={
              <div class='flex items-center justify-center py-16'>
                <div class='text-center'>
                  <div class='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse'>
                    <Users size={24} class='text-blue-600' />
                  </div>
                  <p class='text-gray-500 text-lg'>
                    Loading available rooms...
                  </p>
                </div>
              </div>
            }>
            <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              <For each={availableRooms()}>
                {(room) => (
                  <RoomApplicationCard room={room} onApply={handleJoinRoom} />
                )}
              </For>
            </div>

            {/* Empty state for join rooms */}
            <Show when={availableRooms().length === 0}>
              <div class='text-center py-16'>
                <div class='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Users size={32} class='text-green-600' />
                </div>
                <h3 class='text-lg font-medium text-gray-900 mb-2'>
                  No available rooms to join
                </h3>
                <p class='text-gray-600 mb-6'>
                  All public rooms have been joined or you've created them all!
                </p>
                <button
                  onClick={() => setCreateRoomModalOpen(true)}
                  class='inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200'>
                  <Plus size={18} />
                  Create a New Room
                </button>
              </div>
            </Show>
          </Show>
        </Show>
        <Show when={activeTab() === "activity"}>
          <div class='mb-8'>
            <div class='text-center mb-8'>
              <div class='flex items-center justify-between mb-4'>
                <div class='flex-1'></div>
                <h2 class='text-2xl font-bold text-gray-900'>
                  Recent Activity
                </h2>
                <div class='flex-1 flex justify-end gap-2'>
                  <button
                    onClick={() => {
                      setRecentActivity(generateSampleActivities());
                    }}
                    class='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors'>
                    Load Sample
                  </button>
                  <button
                    onClick={() => {
                      ActivityTracker.clearActivities();
                      setRecentActivity([]);
                    }}
                    class='px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'>
                    Clear
                  </button>
                </div>
              </div>
              <p class='text-gray-600'>
                Stay updated with your latest coding sessions and room
                activities
              </p>
            </div>
          </div>

          <Show
            when={recentActivity().length > 0}
            fallback={
              <div class='text-center py-16'>
                <div class='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Activity size={32} class='text-gray-400' />
                </div>
                <h3 class='text-lg font-medium text-gray-900 mb-2'>
                  No recent activity
                </h3>
                <p class='text-gray-600 mb-6'>
                  Start coding in rooms to see your activity here
                </p>
                <button
                  onClick={() => setActiveTab("overview")}
                  class='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200'>
                  <Code size={18} />
                  Go to Overview
                </button>
              </div>
            }>
            <div class='bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100'>
              <For each={recentActivity()}>
                {(activity) => <ActivityCard activity={activity} />}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default Dashboard;
