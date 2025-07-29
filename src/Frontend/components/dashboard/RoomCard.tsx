import { Show, For, createSignal } from "solid-js";
import type { Component } from "solid-js";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "@solidjs/router";
import {
  Terminal,
  Users,
  Clock,
  Plus,
  Eye,
  Globe,
  Calendar,
  Code,
  Shield,
  Zap,
  UserPlus,
  ExternalLink,
  ChevronRight,
  Activity,
  Hash,
  Crown,
  Sparkles,
} from "lucide-solid";
import type { Room } from "../../../types";
import { useRoomContext } from "../../context/RoomContext";

const getRoomIcon = (hasUsers: boolean) => {
  // Since Room type doesn't have a 'type' property, we'll determine type based on Users array
  if (hasUsers) {
    return <Users size={16} class='text-blue-600' />; // Has users - collaborative
  } else {
    return <Globe size={16} class='text-green-600' />; // No users yet - open to join
  }
};

const formatTimeAgo = (timestamp: any) => {
  if (!timestamp) return "Unknown";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

interface Props {
  room: any;
  onApply: (roomId: string) => void;
  onView?: (roomId: string) => void;
}

export const RoomCard: Component<Props> = (props: { room: Room }) => {
  const navigate = useNavigate();
  const roomContext = useRoomContext();
  const { room } = props;
  const [isHovered, setIsHovered] = createSignal(false);

  const hasUsers = () => Boolean(room.Users && room.Users.length > 0);

  const getRoomTypeColor = () => {
    // Determine type based on room properties since Room doesn't have a type field
    if (hasUsers()) {
      return "border-blue-200 bg-blue-50/30"; // Active room with users
    } else {
      return "border-green-200 bg-green-50/30"; // Open room
    }
  };

  const getRoomTypeBadgeColor = () => {
    if (hasUsers()) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    } else {
      return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getRoomTypeLabel = () => {
    return hasUsers() ? "Active" : "Open";
  };

  return (
    <div
      class={`group relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${getRoomTypeColor()} ${
        isHovered() ? "border-opacity-60" : "border-opacity-40"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Header */}
      <div class='flex items-start justify-between mb-4'>
        <div class='flex items-start gap-3 flex-1'>
          <div class='p-2 bg-white rounded-lg shadow-sm border border-gray-100'>
            {getRoomIcon(hasUsers())}
          </div>
          <div class='flex-1 min-w-0'>
            <div class='flex items-center gap-2 mb-1'>
              <h3 class='font-bold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors'>
                {room.Name}
              </h3>
              <Show when={hasUsers()}>
                <div class='flex items-center gap-1'>
                  <div class='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                  <span class='text-xs text-green-600 font-medium'>Active</span>
                </div>
              </Show>
            </div>
            <div class='flex items-center gap-3 text-sm text-gray-600'>
              <span
                class={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoomTypeBadgeColor()}`}>
                {getRoomIcon(hasUsers())}
                <span class='capitalize'>{getRoomTypeLabel()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <Show when={room.Description}>
        <div class='mb-4'>
          <p class='text-gray-700 text-sm leading-relaxed line-clamp-2'>
            {room.Description}
          </p>
        </div>
      </Show>

      {/* Stats Row */}
      <div class='grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50/70 rounded-lg border border-gray-100'>
        <div class='text-center'>
          <div class='flex items-center justify-center gap-1 text-gray-600 mb-1'>
            <Users size={14} />
          </div>
          <div class='text-sm font-semibold text-gray-900'>
            {1 + (room.Users?.length || 0)}
          </div>
          <div class='text-xs text-gray-500'>Members</div>
        </div>

        <div class='text-center border-l border-r border-gray-200'>
          <div class='flex items-center justify-center gap-1 text-gray-600 mb-1'>
            <Activity size={14} />
          </div>
          <div class='text-sm font-semibold text-gray-900'>
            {room.Messages?.length > 10
              ? "High"
              : room.Messages?.length > 5
              ? "Medium"
              : "Low"}
          </div>
          <div class='text-xs text-gray-500'>Activity</div>
        </div>

        <div class='text-center'>
          <div class='flex items-center justify-center gap-1 text-gray-600 mb-1'>
            <Clock size={14} />
          </div>
          <div class='text-sm font-semibold text-gray-900'>
            {formatTimeAgo(room.createdAt)}
          </div>
          <div class='text-xs text-gray-500'>Created</div>
        </div>
      </div>

      {/* Tags */}
      <Show when={room.Tags?.length}>
        <div class='mb-4'>
          <div class='flex flex-wrap gap-1.5'>
            <For each={room.Tags?.slice(0, 4)}>
              {(tag) => (
                <span class='inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border border-blue-100'>
                  <Hash size={10} />
                  {tag}
                </span>
              )}
            </For>
            <Show when={room.Tags && room.Tags.length > 4}>
              <span class='inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md'>
                +{room.Tags ? room.Tags.length - 4 : 0} more
              </span>
            </Show>
          </div>
        </div>
      </Show>

      {/* Owner Info */}
      <div class='flex items-center justify-between mb-4 pt-3 border-t border-gray-100'>
        <div class='flex items-center gap-2'>
          <div class='w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
            <Crown size={12} class='text-white' />
          </div>
          <div>
            <span class='text-sm font-medium text-gray-900'>
              {room.Createdby}
            </span>
            <div class='text-xs text-gray-500'>Room Owner</div>
          </div>
        </div>

        <div class='flex items-center gap-1'>
          <Code size={12} class='text-blue-500' />
          <span class='text-xs font-medium text-gray-700'>Coding Room</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div class='flex gap-2'>
        <button
          class='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] group/join'
          onClick={() => {
            console.log("🚀 Navigating to room:", room.RoomId);
            // Set the current room in context for better state management
            roomContext.setCurrentRoom(room);
            navigate(`/rooms/${room.RoomId}`);
          }}>
          <UserPlus
            size={14}
            class='group-hover/join:scale-110 transition-transform'
          />
          <span>Enter</span>
          <ChevronRight
            size={12}
            class='group-hover/join:translate-x-0.5 transition-transform'
          />
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div
        class={`absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>

      {/* Top Corner Decoration */}
      <div class='absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
    </div>
  );
};
