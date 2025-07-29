import type { ActivityItem } from "../../../types";
import {
  UserPlus,
  Plus,
  Code,
  MessageCircle,
  Activity,
  UserMinus,
  FileText,
  MessageSquare,
  UserCheck,
  HelpCircle,
  Share,
  Edit3,
} from "lucide-solid";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "join":
      return <UserPlus size={16} class='text-green-600' />;
    case "create":
      return <Plus size={16} class='text-blue-600' />;
    case "code":
      return <Code size={16} class='text-purple-600' />;
    case "message":
      return <MessageCircle size={16} class='text-blue-500' />;
    case "leave":
      return <UserMinus size={16} class='text-red-500' />;
    case "file":
      return <FileText size={16} class='text-orange-500' />;
    case "comment":
      return <MessageSquare size={16} class='text-teal-500' />;
    case "invite":
      return <UserCheck size={16} class='text-indigo-500' />;
    case "help":
      return <HelpCircle size={16} class='text-yellow-500' />;
    case "share":
      return <Share size={16} class='text-pink-500' />;
    case "edit":
      return <Edit3 size={16} class='text-gray-600' />;
    default:
      return <Activity size={16} class='text-gray-500' />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "join":
      return "bg-green-50 border-green-200";
    case "create":
      return "bg-blue-50 border-blue-200";
    case "code":
      return "bg-purple-50 border-purple-200";
    case "message":
      return "bg-blue-50 border-blue-200";
    case "leave":
      return "bg-red-50 border-red-200";
    case "file":
      return "bg-orange-50 border-orange-200";
    case "comment":
      return "bg-teal-50 border-teal-200";
    case "invite":
      return "bg-indigo-50 border-indigo-200";
    case "help":
      return "bg-yellow-50 border-yellow-200";
    case "share":
      return "bg-pink-50 border-pink-200";
    case "edit":
      return "bg-gray-50 border-gray-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export const ActivityCard = (props: { activity: ActivityItem }) => (
  <div
    class={`p-4 border rounded-lg hover:shadow-sm transition-all duration-200 ${getActivityColor(
      props.activity.type
    )}`}>
    <div class='flex items-start gap-3'>
      <div class='p-2 bg-white rounded-lg shadow-sm border'>
        {getActivityIcon(props.activity.type)}
      </div>
      <div class='flex-1 min-w-0'>
        <p class='text-sm text-gray-900 leading-relaxed'>
          <span class='font-semibold'>{props.activity.user}</span>{" "}
          {props.activity.description}
          {props.activity.roomName && (
            <>
              {" in "}
              <span class='font-medium text-blue-600'>
                {props.activity.roomName}
              </span>
            </>
          )}
        </p>

        {/* Metadata display */}
        {props.activity.metadata && (
          <div class='mt-2 flex flex-wrap gap-2'>
            {props.activity.metadata.fileName && (
              <span class='inline-flex items-center gap-1 px-2 py-1 bg-white/70 text-xs rounded-md border'>
                <FileText size={10} />
                {props.activity.metadata.fileName}
              </span>
            )}
            {props.activity.metadata.language && (
              <span class='inline-flex items-center gap-1 px-2 py-1 bg-white/70 text-xs rounded-md border'>
                <Code size={10} />
                {props.activity.metadata.language}
              </span>
            )}
            {props.activity.metadata.lineCount && (
              <span class='inline-flex items-center px-2 py-1 bg-white/70 text-xs rounded-md border'>
                {props.activity.metadata.lineCount} lines
              </span>
            )}
          </div>
        )}

        <p class='text-xs text-gray-500 mt-2 font-medium'>
          {formatTimeAgo(props.activity.timestamp)}
        </p>
      </div>
    </div>
  </div>
);
