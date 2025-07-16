import { Show, For } from "solid-js";
import type { Room } from "../../../types";
// import { getRoomIcon } from "../../../utils/icons";
import { Users, Clock, Terminal, Eye, Play, MoreVertical } from "lucide-solid";
import { Globe, Lock, Code } from "lucide-solid";
const getRoomIcon = (type: string) => {
  switch (type) {
    case "public":
      return <Globe size={16} />;
    case "private":
      return <Lock size={16} />;
    case "temporary":
      return <Clock size={16} />;
    default:
      return <Code size={16} />;
  }
};

export const RoomCard = (props: { room: any; showActions?: boolean }) => (
  <div class='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
    <div class='flex items-start justify-between mb-3'>
      <div class='flex items-center gap-2'>
        {getRoomIcon(props.room.type)}
        <h3 class='font-semibold text-gray-900'>{props.room.name}</h3>
        <Show when={props.room.isActive}>
          <div class='w-2 h-2 bg-green-500 rounded-full'></div>
        </Show>
      </div>
      <Show when={props.showActions}>
        <button class='p-1 hover:bg-gray-100 rounded'>
          <MoreVertical size={16} />
        </button>
      </Show>
    </div>

    <div class='space-y-2'>
      <div class='flex items-center gap-2 text-sm text-gray-600'>
        <Terminal size={14} />
        <span>{props.room.language}</span>
      </div>

      <div class='flex items-center gap-4 text-sm text-gray-600'>
        <div class='flex items-center gap-1'>
          <Users size={14} />
          <span>{props.room.members}</span>
        </div>
        <div class='flex items-center gap-1'>
          <Clock size={14} />
          <span>{props.room.lastActivity}</span>
        </div>
      </div>

      <Show when={props.room.description}>
        <p class='text-sm text-gray-600'>{props.room.description}</p>
      </Show>

      <Show when={props.room.tags}>
        <div class='flex flex-wrap gap-1'>
          <For each={props.room.tags}>
            {(tag) => (
              <span class='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                {tag}
              </span>
            )}
          </For>
        </div>
      </Show>
    </div>

    <div class='mt-4 flex justify-between items-center'>
      <span class='text-sm text-gray-500'>by {props.room.owner}</span>
      <div class='flex gap-2'>
        <button class='px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm'>
          <Eye size={14} class='inline mr-1' />
          View
        </button>
        <button class='px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm'>
          <Play size={14} class='inline mr-1' />
          Join
        </button>
      </div>
    </div>
  </div>
);
