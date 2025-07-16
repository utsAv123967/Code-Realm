import { For } from "solid-js";
import { TrendingUp, Users, Plus, Clock, Activity } from "lucide-solid";
export const TabNav = (props: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => (
  <nav class='flex space-x-8 border-b border-gray-200'>
    <For
      each={[
        { id: "overview", label: "Overview", icon: <TrendingUp size={16} /> },
        { id: "joined", label: "Joined Rooms", icon: <Users size={16} /> },
        { id: "created", label: "Created Rooms", icon: <Plus size={16} /> },
        {
          id: "Join Room",
          label: "Join Room",
          icon: <Clock size={16} />,
        },
        {
          id: "activity",
          label: "Recent Activity",
          icon: <Activity size={16} />,
        },
      ]}>
      {(tab) => (
        <button
          onClick={() => props.setActiveTab(tab.id)}
          class={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            props.activeTab === tab.id
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}>
          {tab.icon}
          {tab.label}
        </button>
      )}
    </For>
  </nav>
);
