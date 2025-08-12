import { createSignal, For, onMount, onCleanup, createEffect } from "solid-js";
import { FiUsers, FiX, FiSend, FiWifi, FiWifiOff } from "solid-icons/fi";
import { chatWebSocket } from "../services/firebaseChatService";
import { getCurrentUser, getUserId } from "../../context/Userdetails";

interface TeamChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  connectedUsers: Array<{
    name: string;
    online: boolean;
    color: string;
  }>;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type?: "message" | "system";
}

export const TeamChatModal = (props: TeamChatModalProps) => {
  const [memberMessage, setMemberMessage] = createSignal("");
  const [isTyping, setIsTyping] = createSignal(false);
  const [localMessages, setLocalMessages] = createSignal<Message[]>([
    {
      id: "1",
      sender: "System",
      content:
        "Welcome to the team chat! Share ideas and collaborate in real-time.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "system",
    },
  ]);

  let typingTimer: NodeJS.Timeout;
  let messagesContainer: HTMLDivElement | undefined;

  // Get current user info
  const currentUser = () => {
    const currentUserId = getUserId();
    const currentUserData = getCurrentUser();
    const user = props.connectedUsers.find((u) => u.name === currentUserId);
    return (
      user || {
        name: currentUserData?.displayName || "You",
        color: "#6B7280",
        online: true,
        userId: currentUserId || "unknown",
      }
    );
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping()) {
      setIsTyping(true);
      chatWebSocket.sendTyping(
        props.roomId,
        getUserId() || "unknown",
        currentUser().name,
        true
      );
    }

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      setIsTyping(false);
      chatWebSocket.sendTyping(
        props.roomId,
        getUserId() || "unknown",
        currentUser().name,
        false
      );
    }, 1000);
  };

  const sendMemberMessage = (e: Event) => {
    e.preventDefault();
    if (memberMessage().trim() === "") return;

    // Send via WebSocket
    chatWebSocket.sendMessage(
      props.roomId,
      getUserId() || "unknown",
      currentUser().name,
      memberMessage()
    );

    setMemberMessage("");
    setIsTyping(false);
    clearTimeout(typingTimer);

    // Auto-scroll after message is sent
    setTimeout(scrollToBottom, 100);
  };

  // Join room when modal opens
  createEffect(() => {
    if (props.isOpen) {
      chatWebSocket.joinRoom(
        props.roomId,
        getUserId() || "unknown",
        currentUser().name
      );
      setTimeout(scrollToBottom, 100);
    }
  });

  onMount(() => {
    // Set up real-time message listener
    createEffect(() => {
      const wsMessages = chatWebSocket.getMessages();
      // Messages are already filtered by room in the service
      const formattedMessages: Message[] = wsMessages.map((msg: any) => ({
        id: msg.id,
        sender: msg.senderName,
        content: msg.content,
        timestamp: msg.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "message", // Only message type now, no join/leave
      }));

      // Set messages directly (no need to merge with local messages)
      setLocalMessages(formattedMessages);

      // Auto-scroll to bottom when new messages arrive
      setTimeout(scrollToBottom, 100);
    });
  });

  onCleanup(() => {
    clearTimeout(typingTimer);
    if (props.isOpen) {
      chatWebSocket.leaveRoom(props.roomId, getUserId() || "unknown");
    }
  });

  return (
    <>
      {props.isOpen && (
        <>
          {/* Modal Backdrop with just blur, background stays visible */}
          <div
            class='fixed inset-0 backdrop-blur-sm z-40'
            onClick={props.onClose}
            style={{ "backdrop-filter": "blur(3px)" }}
          />

          {/* Modal Content */}
          <div class='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div class='bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden border border-gray-200'>
              {/* Chat Header */}
              <div class='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'>
                <div class='flex items-center justify-between'>
                  <div class='flex items-center gap-3'>
                    <FiUsers class='text-purple-600 text-lg' />
                    <div>
                      <h2 class='text-lg font-semibold text-gray-900'>
                        Team Chat
                      </h2>
                      <div class='flex items-center gap-2 text-sm text-gray-600'>
                        {chatWebSocket.getIsConnected() ? (
                          <>
                            <FiWifi class='text-green-500 text-xs' />
                            <span>Connected</span>
                          </>
                        ) : (
                          <>
                            <FiWifiOff class='text-red-500 text-xs' />
                            <span>Reconnecting...</span>
                          </>
                        )}
                        <span class='ml-2'>
                          ({props.connectedUsers.filter((u) => u.online).length}{" "}
                          online)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={props.onClose}
                    class='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                    <FiX class='text-gray-500 text-lg' />
                  </button>
                </div>
              </div>

              {/* Online Users */}
              <div class='px-6 py-3 border-b border-gray-100 bg-gray-50'>
                <div class='flex items-center gap-2 overflow-x-auto'>
                  <span class='text-xs font-medium text-gray-600 whitespace-nowrap'>
                    Online:
                  </span>
                  <div class='flex gap-1'>
                    <For each={props.connectedUsers.filter((u) => u.online)}>
                      {(user) => (
                        <div
                          class='w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0'
                          style={{ "background-color": user.color }}
                          title={user.name}>
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              {/* Messages Content */}
              <div
                ref={messagesContainer!}
                class='flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50'>
                <For each={localMessages()}>
                  {(message) => (
                    <div
                      class={`${
                        message.type === "system"
                          ? "text-center"
                          : "flex items-start gap-3"
                      }`}>
                      {message.type === "system" ? (
                        <div class='bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm'>
                          {message.content}
                        </div>
                      ) : (
                        <>
                          <div
                            class='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0'
                            style={{
                              "background-color":
                                props.connectedUsers.find(
                                  (u) => u.name === message.sender
                                )?.color || "#6B7280",
                            }}>
                            {message.sender.charAt(0)}
                          </div>
                          <div class='flex-1 min-w-0'>
                            <div class='bg-white rounded-lg p-3 shadow-sm border border-gray-200'>
                              <div class='flex justify-between items-center mb-1'>
                                <span class='font-semibold text-sm text-gray-900 truncate'>
                                  {message.sender}
                                </span>
                                <span class='text-xs text-gray-500 flex-shrink-0 ml-2'>
                                  {message.timestamp}
                                </span>
                              </div>
                              <p class='text-sm text-gray-800 leading-relaxed break-words'>
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </For>

                {/* Typing Indicators */}
                {chatWebSocket
                  .getTypingUsers()
                  .filter((user: any) => user !== currentUser().name).length >
                  0 && (
                  <div class='flex items-center gap-2 text-sm text-gray-500'>
                    <div class='flex space-x-1'>
                      <div class='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div
                        class='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ "animation-delay": "0.1s" }}></div>
                      <div
                        class='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ "animation-delay": "0.2s" }}></div>
                    </div>
                    <span>
                      {chatWebSocket
                        .getTypingUsers()
                        .filter((user: any) => user !== currentUser().name)
                        .join(", ")}
                      {chatWebSocket
                        .getTypingUsers()
                        .filter((user: any) => user !== currentUser().name)
                        .length === 1
                        ? " is"
                        : " are"}{" "}
                      typing...
                    </span>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div class='p-4 border-t border-gray-200 bg-white'>
                <form onSubmit={sendMemberMessage} class='flex gap-2'>
                  <input
                    type='text'
                    value={memberMessage()}
                    onInput={(e) => {
                      setMemberMessage(e.target.value);
                      handleTyping();
                    }}
                    placeholder='Type your message...'
                    class='flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:bg-white transition-all text-sm'
                  />
                  <button
                    type='submit'
                    disabled={
                      !memberMessage().trim() || !chatWebSocket.getIsConnected()
                    }
                    class={`px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
                      memberMessage().trim() && chatWebSocket.getIsConnected()
                        ? "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}>
                    <FiSend class='text-sm' />
                  </button>
                </form>
                {!chatWebSocket.getIsConnected() && (
                  <div class='text-xs text-red-500 mt-2 text-center'>
                    Connection lost. Messages will be sent when reconnected.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
