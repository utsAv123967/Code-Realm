import { Show, For, createSignal } from "solid-js";
import type { Component } from "solid-js";
import { Timestamp } from "firebase/firestore";
import {
  Terminal,
  Users,
  Clock,
  Plus,
  Eye,
  Lock,
  Globe,
  MessageCircle,
  Calendar,
  Code,
  Star,
  Shield,
  Zap,
  UserPlus,
  ExternalLink,
  ChevronRight,
  Activity,
  Timer,
  Hash,
  Crown,
  Sparkles,
} from "lucide-solid";

const getRoomIcon = (type: string) => {
  switch (type) {
    case "public":
      return <Globe size={16} class='text-green-600' />;
    case "private":
      return <Lock size={16} class='text-orange-600' />;
    case "temporary":
      return <Timer size={16} class='text-purple-600' />;
    default:
      return <MessageCircle size={16} class='text-blue-600' />;
  }
};

const getLanguageIcon = (language: string) => {
  const icons: { [key: string]: string } = {
    javascript: "🟨",
    python: "🐍",
    java: "☕",
    cpp: "⚡",
    csharp: "🔷",
    rust: "🦀",
    go: "🐹",
    typescript: "🔷",
    php: "🐘",
    ruby: "💎",
    swift: "🐦",
    kotlin: "🎯",
    scala: "🏗️",
    dart: "🎯",
    r: "📊",
    julia: "🔬",
    html: "🌐",
    css: "🎨",
    sql: "🗃️",
    shell: "🐚",
  };
  return icons[language?.toLowerCase()] || "💻";
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

export const RoomApplicationCard: Component<Props> = (props) => {
  const { room, onApply, onView } = props;
  const [isHovered, setIsHovered] = createSignal(false);

  const getRoomTypeColor = () => {
    switch (room.type) {
      case "public":
        return "border-green-200 bg-green-50/30";
      case "private":
        return "border-orange-200 bg-orange-50/30";
      case "temporary":
        return "border-purple-200 bg-purple-50/30";
      default:
        return "border-blue-200 bg-blue-50/30";
    }
  };

  const getRoomTypeBadgeColor = () => {
    switch (room.type) {
      case "public":
        return "bg-green-100 text-green-700 border-green-200";
      case "private":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "temporary":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
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
            {getRoomIcon(room.type)}
          </div>
          <div class='flex-1 min-w-0'>
            <div class='flex items-center gap-2 mb-1'>
              <h3 class='font-bold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors'>
                {room.Name}
              </h3>
              <Show when={room.isActive}>
                <div class='flex items-center gap-1'>
                  <div class='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                  <span class='text-xs text-green-600 font-medium'>Live</span>
                </div>
              </Show>
            </div>
            <div class='flex items-center gap-3 text-sm text-gray-600'>
              <span
                class={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoomTypeBadgeColor()}`}>
                {getRoomIcon(room.type)}
                <span class='capitalize'>{room.type}</span>
              </span>
              <Show when={room.language}>
                <span class='inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'>
                  <span>{getLanguageIcon(room.language)}</span>
                  {room.language}
                </span>
              </Show>
            </div>
          </div>
        </div>

        <div class='flex items-center gap-2'>
          <Show when={room.featured}>
            <div class='p-1 bg-yellow-100 rounded-full' title='Featured Room'>
              <Star size={14} class='text-yellow-600' />
            </div>
          </Show>
          <Show when={room.isVerified}>
            <div class='p-1 bg-blue-100 rounded-full' title='Verified Room'>
              <Shield size={14} class='text-blue-600' />
            </div>
          </Show>
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
            {room.activityLevel || "Medium"}
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
      <Show when={room.tags?.length}>
        <div class='mb-4'>
          <div class='flex flex-wrap gap-1.5'>
            <For each={room.tags?.slice(0, 4)}>
              {(tag) => (
                <span class='inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border border-blue-100'>
                  <Hash size={10} />
                  {tag}
                </span>
              )}
            </For>
            <Show when={room.tags?.length > 4}>
              <span class='inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md'>
                +{room.tags.length - 4} more
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
            <span class='text-sm font-medium text-gray-900'>{room.owner}</span>
            <div class='text-xs text-gray-500'>Room Owner</div>
          </div>
        </div>

        <Show when={room.rating}>
          <div class='flex items-center gap-1'>
            <Star size={12} class='text-yellow-500 fill-current' />
            <span class='text-xs font-medium text-gray-700'>{room.rating}</span>
          </div>
        </Show>
      </div>

      {/* Action Buttons */}
      <div class='flex gap-2'>
        <button
          class='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-200 group/btn'
          onClick={() => onView?.(room.id)}>
          <Eye
            size={14}
            class='group-hover/btn:scale-110 transition-transform'
          />
          <span>Preview</span>
          <ExternalLink
            size={12}
            class='opacity-0 group-hover/btn:opacity-100 transition-opacity'
          />
        </button>

        <button
          class='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] group/join'
          onClick={() => onApply(room.id)}>
          <UserPlus
            size={14}
            class='group-hover/join:scale-110 transition-transform'
          />
          <span>Join Room</span>
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

// Add these CSS classes to your global styles
const styles = `
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
}

.group:hover .animate-glow {
  animation: glow 2s ease-in-out infinite;
}
`;
