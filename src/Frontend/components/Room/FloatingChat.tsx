import { createSignal, Show } from "solid-js";
import { FiMessageCircle, FiX, FiSend, FiUsers } from "solid-icons/fi";
import { chatWebSocket } from "../../services/firebaseChatService";
import { getCurrentUser, getUserId } from "../../../context/Userdetails";

interface FloatingChatProps {
  roomId: string;
  connectedUsers: Array<{
    name: string;
    online: boolean;
    color: string;
  }>;
}

const FloatingChat = (props: FloatingChatProps) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [unreadCount, setUnreadCount] = createSignal(0);

  const sendMessage = (e: Event) => {
    e.preventDefault();
    if (!message().trim()) return;

    chatWebSocket.sendMessage(
      props.roomId,
      getUserId() || "unknown",
      getCurrentUser()?.displayName || "Anonymous",
      message()
    );
    setMessage("");
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div class='fixed bottom-6 right-6 z-50'>
        <Show
          when={!isExpanded()}
          fallback={
            /* Expanded Chat Window */
            <div class='bg-white rounded-xl shadow-2xl w-80 h-96 flex flex-col border border-gray-200 overflow-hidden'>
              {/* Header */}
              <div class='flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                <div class='flex items-center gap-2'>
                  <FiUsers class='text-lg' />
                  <span class='font-medium'>Team Chat</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  class='p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors'>
                  <FiX class='text-lg' />
                </button>
              </div>

              {/* Messages Area */}
              <div class='flex-1 p-3 overflow-y-auto bg-gray-50'>
                <div class='space-y-2'>
                  {/* Messages would go here */}
                  <div class='bg-white p-2 rounded-lg shadow-sm'>
                    <div class='text-xs text-gray-500 mb-1'>John • 2:30 PM</div>
                    <div class='text-sm'>Hey everyone! 👋</div>
                  </div>
                  <div class='bg-purple-100 p-2 rounded-lg ml-4'>
                    <div class='text-xs text-gray-500 mb-1'>You • 2:31 PM</div>
                    <div class='text-sm'>Hello! Ready to code!</div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <form
                onSubmit={sendMessage}
                class='p-3 border-t border-gray-200 bg-white'>
                <div class='flex gap-2'>
                  <input
                    type='text'
                    value={message()}
                    onInput={(e) => setMessage(e.target.value)}
                    placeholder='Type a message...'
                    class='flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500'
                  />
                  <button
                    type='submit'
                    disabled={!message().trim()}
                    class='px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors'>
                    <FiSend class='text-sm' />
                  </button>
                </div>
              </form>
            </div>
          }>
          {/* Chat Bubble */}
          <button
            onClick={() => {
              setIsExpanded(true);
              setUnreadCount(0);
            }}
            class='relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200'>
            <FiMessageCircle class='text-2xl' />

            {/* Unread Badge */}
            <Show when={unreadCount() > 0}>
              <div class='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold'>
                {unreadCount()}
              </div>
            </Show>

            {/* Online Indicator */}
            <div class='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full'></div>
          </button>
        </Show>
      </div>

      {/* Click Outside to Close */}
      <Show when={isExpanded()}>
        <div class='fixed inset-0 z-40' onClick={() => setIsExpanded(false)} />
      </Show>
    </>
  );
};

export default FloatingChat;
