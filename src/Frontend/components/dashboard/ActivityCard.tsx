import type { ActivityItem } from "../../../types";
// import { getActivityIcon } from "../../../utils/icons";
import { UserPlus, Plus, Code, MessageCircle, Activity } from "lucide-solid";
const getActivityIcon = (type: string) => {
  switch (type) {
    case "join":
      return <UserPlus size={16} />;
    case "create":
      return <Plus size={16} />;
    case "code":
      return <Code size={16} />;
    case "message":
      return <MessageCircle size={16} />;
    default:
      return <Activity size={16} />;
  }
};
export const ActivityCard = (props: { activity: ActivityItem }) => (
  <div class='p-6 flex items-center gap-4'>
    <div class='p-2 bg-gray-100 rounded-lg'>
      {getActivityIcon(props.activity.type)}
    </div>
    <div class='flex-1'>
      <p class='text-sm text-gray-900'>
        <span class='font-medium'>{props.activity.user}</span>{" "}
        {props.activity.description} in{" "}
        <span class='font-medium'>{props.activity.roomName}</span>
      </p>
      <p class='text-xs text-gray-500 mt-1'>
        {props.activity.timestamp.toLocaleString()}
      </p>
    </div>
  </div>
);
