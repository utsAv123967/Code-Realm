import { createSignal, createMemo, For, Show, onMount } from "solid-js";
import { Plus, Users, Zap, Code, Search, Sparkles, Compass, ArrowRight } from "lucide-solid";
import { RoomCard } from "./RoomCard";
import { RoomApplicationCard } from "./RoomApplicationCard";
import { CreateRoomModal } from "../../modals/createRoomModal";
import { useRoomContext } from "../../context/RoomContext";
import { userId, getCurrentUser } from "../../../context/Userdetails";
import { applyToRoom } from "../../../Backend/Database/Apply_to_room";
const Dashboard = () => {
  // Debug: Log user authentication status
  console.log("Dashboard loaded - User ID:", userId());
  console.log("Dashboard loaded - Current User:", getCurrentUser());

  // Use room context instead of direct API calls
  const roomContext = useRoomContext();

  const [searchTerm, setSearchTerm] = createSignal("");
  const [viewFilter, setViewFilter] = createSignal<"all" | "joined" | "created">("all");
  const filters = ["all", "created", "joined"] as const;
  const [createRoomModalOpen, setCreateRoomModalOpen] = createSignal(false);

  onMount(() => {
    roomContext.fetchAvailableRooms();
  });

  // Handle joining a room
  const handleJoinRoom = async (roomId: string) => {
    const currentUserId = userId();
    if (!currentUserId) {
      console.error("User not authenticated");
      return;
    }

    try {
      console.log("Joining room:", roomId);
      await applyToRoom(roomId, currentUserId);
      await roomContext.refreshRooms();
      await roomContext.fetchAvailableRooms();
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

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

  const totalRooms = createMemo(
    () => createdRooms().length + joinedRooms().length
  );

  const activeRooms = createMemo(
    () => totalRooms() + roomContext.availableRooms().length
  );

  const totalMembers = createMemo(
    () =>
      [...joinedRooms(), ...createdRooms()].reduce(
        (sum, room) => sum + (room.Users?.length || 0),
        0
      )
  );

  const filteredMyRooms = createMemo(() => {
    const term = searchTerm().toLowerCase().trim();
    let source = [...createdRooms(), ...joinedRooms()];

    if (viewFilter() === "created") {
      source = createdRooms();
    } else if (viewFilter() === "joined") {
      source = joinedRooms();
    }

    return source.filter((room) =>
      room.Name.toLowerCase().includes(term)
    );
  });

  const trendingTags = createMemo(() => {
    const tags = new Set<string>();
    [...createdRooms(), ...joinedRooms()].forEach((room) => {
      room.Tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).slice(0, 6);
  });

  const stats = createMemo(() => [
    {
      label: "Total rooms",
      value: totalRooms(),
      caption: "Spaces you collaborate in",
      accent: "from-blue-500 via-indigo-500 to-blue-700",
      icon: Code,
    },
    {
      label: "Active spaces",
      value: activeRooms(),
      caption: "Including public rooms you can explore",
      accent: "from-emerald-500 via-teal-500 to-emerald-600",
      icon: Zap,
    },
    {
      label: "Collaborators",
      value: totalMembers(),
      caption: "Teammates across your rooms",
      accent: "from-purple-500 via-fuchsia-500 to-purple-600",
      icon: Users,
    },
  ]);

  const membershipDate = (() => {
    const meta = (getCurrentUser() as any)?.metadata?.creationTime;
    if (meta) {
      return new Date(meta).toLocaleDateString();
    }
    return new Date().toLocaleDateString();
  })();

  const scrollToExplore = () => {
    if (typeof window === "undefined") return;
    const section = document.getElementById("explore-rooms");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToAbout = () => {
    if (typeof window === "undefined") return;
    window.location.href = "/about";
  };

  const initials =
    getCurrentUser()?.displayName?.charAt(0) ||
    getCurrentUser()?.email?.charAt(0) ||
    "U";

  const displayName =
    getCurrentUser()?.displayName ||
    getCurrentUser()?.email?.split("@")[0] ||
    "Creator";

  return (
    <div class='relative mt-14 pb-24'>
      <div class='mx-auto max-w-7xl space-y-16 px-6'>
        <section class='relative overflow-hidden rounded-[44px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-10 shadow-[0_40px_120px_-60px_rgba(8,15,45,0.8)] text-white'>
          <div class='pointer-events-none absolute inset-0'>
            <div class='absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl'></div>
            <div class='absolute right-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-purple-500/25 blur-3xl'></div>
            <div class='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]'></div>
            <div class='absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.06)_0%,_rgba(255,255,255,0)_40%,_rgba(255,255,255,0.12)_100%)] opacity-60'></div>
          </div>

          <div class='relative grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center'>
            <div class='space-y-6'>
              <div class='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-white/70'>
                <Sparkles size={14} />
                <span>Creator control room</span>
              </div>
              <div>
                <h1 class='text-4xl font-bold tracking-tight sm:text-5xl'>Welcome back, {displayName}</h1>
                <p class='mt-3 max-w-2xl text-base text-slate-100/80'>Craft premium coding experiences, manage your rooms, and discover collaborations curated for builders like you.</p>
              </div>
              <div class='flex flex-wrap items-center gap-3'>
                <button
                  class='inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/20 transition hover:bg-slate-100'
                  onClick={() => setCreateRoomModalOpen(true)}>
                  <Plus size={16} />
                  <span>Create a room</span>
                </button>
                <button
                  class='inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10'
                  onClick={scrollToExplore}>
                  <Compass size={16} />
                  <span>Discover rooms</span>
                </button>
                <button
                  class='inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10'
                  onClick={goToAbout}>
                  <ArrowRight size={16} />
                  <span>About us</span>
                </button>
              </div>
              <Show when={trendingTags().length > 0}>
                <div>
                  <p class='text-xs font-semibold uppercase tracking-[0.4em] text-white/50'>Trending tags</p>
                  <div class='mt-3 flex flex-wrap gap-2'>
                    <For each={trendingTags()}>
                      {(tag) => (
                        <span class='inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70'>
                          #{tag}
                        </span>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>

            <div class='relative rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-2xl'>
              <div class='flex items-center gap-4'>
                <div class='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-semibold text-white'>
                  {initials}
                </div>
                <div>
                  <p class='text-xs uppercase tracking-[0.4em] text-white/50'>Member since</p>
                  <p class='text-lg font-semibold text-white'>{membershipDate}</p>
                </div>
              </div>
              <div class='mt-6 grid gap-3'>
                <For each={stats()}>
                  {(stat) => (
                    <div class='flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80'>
                      <div class='flex items-center gap-2 text-white/70'>
                        <stat.icon size={16} />
                        <span>{stat.label}</span>
                      </div>
                      <span class='text-base text-white'>{stat.value}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </section>

        <section class='grid gap-6 md:grid-cols-3'>
          <For each={stats()}>
            {(stat) => (
              <div class={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur transition hover:shadow-2xl`}>
                <div class={`absolute -top-20 right-0 h-40 w-40 opacity-40 blur-3xl bg-gradient-to-r ${stat.accent}`}></div>
                <div class='relative flex flex-col gap-3'>
                  <div class='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500'>
                    <stat.icon size={16} class='text-slate-400' />
                    <span>{stat.label}</span>
                  </div>
                  <div class='text-4xl font-bold tracking-tight text-slate-900'>{stat.value}</div>
                  <p class='text-sm text-slate-600'>{stat.caption}</p>
                </div>
              </div>
            )}
          </For>
        </section>

        <section class='rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur'>
          <div class='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <p class='text-xs font-semibold uppercase tracking-[0.4em] text-blue-600'>My rooms</p>
              <h2 class='mt-2 text-3xl font-bold text-slate-900'>Spaces you steward</h2>
              <p class='mt-2 max-w-2xl text-sm text-slate-600'>Jump back into active rooms or spin up something new. Filter by created or joined rooms to focus the list.</p>
            </div>
            <div class='flex flex-wrap items-center gap-3'>
              <For each={filters}>
                {(filter) => (
                  <button
                    class={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      viewFilter() === filter
                        ? "bg-slate-900 text-white shadow"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    onClick={() => setViewFilter(filter)}>
                    {filter === "all" ? "All" : filter === "joined" ? "Joined" : "Created"}
                  </button>
                )}
              </For>
            </div>
          </div>

          <div class='mt-6 flex flex-col gap-6'>
            <div class='relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-inner'>
              <Search size={16} class='pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-300' />
              <input
                type='text'
                placeholder='Search rooms by name'
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
                class='w-full rounded-2xl border border-transparent bg-transparent pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-0'
              />
            </div>

            <Show
              when={filteredMyRooms().length > 0}
              fallback={
                <div class='flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-16 text-center text-slate-500'>
                  <div class='mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-500'>
                    <Code size={24} />
                  </div>
                  <h3 class='text-xl font-semibold text-slate-700'>No rooms yet</h3>
                  <p class='mt-2 text-sm text-slate-500'>Create your first room or join an existing one to see it appear here.</p>
                  <button
                    class='mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500'
                    onClick={() => setCreateRoomModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create a room</span>
                  </button>
                </div>
              }>
              <div class='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                <For each={filteredMyRooms()}>
                  {(room) => <RoomCard room={room} onApply={() => {}} />}
                </For>
              </div>
            </Show>
          </div>
        </section>

        <section id='explore-rooms' class='rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur'>
          <div class='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p class='text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600'>Explore</p>
              <h2 class='mt-2 text-3xl font-bold text-slate-900'>Open rooms to join</h2>
              <p class='mt-2 max-w-2xl text-sm text-slate-600'>Handpicked rooms from across the community. Join instantly and bring your expertise to the table.</p>
            </div>
            <button
              class='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100'
              onClick={() => roomContext.fetchAvailableRooms()}>
              <Sparkles size={16} />
              <span>Refresh list</span>
            </button>
          </div>

          <Show
            when={!roomContext.availableRoomsLoading()}
            fallback={
              <div class='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-6 py-16 text-center text-emerald-600'>
                <div class='flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white'>
                  <Users size={22} />
                </div>
                <p class='text-base font-semibold'>Loading available rooms...</p>
                <p class='text-sm text-emerald-500'>Matching you with active collaborators</p>
              </div>
            }>
            <Show
              when={roomContext.availableRooms().length > 0}
              fallback={
                <div class='flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-6 py-16 text-center text-emerald-600'>
                  <div class='flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white'>
                    <Users size={22} />
                  </div>
                  <p class='mt-3 text-base font-semibold'>No public rooms right now</p>
                  <p class='mt-1 text-sm text-emerald-500'>Be the first to start a new session for others to discover.</p>
                  <button
                    class='mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-500'
                    onClick={() => setCreateRoomModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create a room</span>
                  </button>
                </div>
              }>
              <div class='mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                <For each={roomContext.availableRooms()}>
                  {(room) => (
                    <RoomApplicationCard room={room} onApply={handleJoinRoom} />
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </section>
      </div>

      <Show when={createRoomModalOpen()}>
        <CreateRoomModal
          isOpen={createRoomModalOpen()}
          onClose={() => setCreateRoomModalOpen(false)}
          onRoomCreated={async () => {
            await roomContext.refreshRooms();
            await roomContext.fetchAvailableRooms();
          }}
        />
      </Show>
    </div>
  );
};

export default Dashboard;
