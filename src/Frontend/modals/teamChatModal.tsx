import { createSignal, For } from "solid-js";
import { FiUsers } from "solid-icons/fi";

interface TeamChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedUsers: Array<{
    name: string;
    online: boolean;
    color: string;
  }>;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export const TeamChatModal = (props: TeamChatModalProps) => {
  const [memberMessages, setMemberMessages] = createSignal<Message[]>([
    {
      id: 1,
      sender: "Utsav",
      content: "Hey everyone! Ready to start coding?",
      timestamp: "10:25 AM",
    },
    {
      id: 2,
      sender: "Raj",
      content: "Yes! Let's work on the algorithm together.",
      timestamp: "10:26 AM",
    },
  ]);
  const [memberMessage, setMemberMessage] = createSignal("");

  const sendMemberMessage = (e: Event) => {
    e.preventDefault();
    if (memberMessage().trim() === "") return;

    const newMsg: Message = {
      id: memberMessages().length + 1,
      sender: "You", // In real app, this would be the current user's name
      content: memberMessage(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMemberMessages([...memberMessages(), newMsg]);
    setMemberMessage("");
  };

  return (
    <>
      {props.isOpen && (
        <div class='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div class='bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col m-4'>
            {/* Chat Header */}
            <div class='px-6 py-4 border-b border-gray-200 bg-purple-50'>
              <div class='flex items-center justify-between'>
                <div class='flex items-center gap-2'>
                  <FiUsers class='text-purple-600' />
                  <h2 class='text-lg font-semibold text-gray-900'>Team Chat</h2>
                  <span class='text-sm text-gray-600'>
                    ({props.connectedUsers.filter((u) => u.online).length}{" "}
                    online)
                  </span>
                </div>
                <button
                  onClick={props.onClose}
                  class='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                  <svg
                    class='w-5 h-5 text-gray-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Content */}
            <div class='flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50'>
              <For each={memberMessages()}>
                {(message) => (
                  <div class='flex items-start gap-3'>
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
                    <div class='flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-200'>
                      <div class='flex justify-between items-center mb-1'>
                        <span class='font-semibold text-sm text-gray-900'>
                          {message.sender}
                        </span>
                        <span class='text-xs text-gray-500'>
                          {message.timestamp}
                        </span>
                      </div>
                      <p class='text-sm text-gray-800 leading-relaxed'>
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}
              </For>
            </div>

            {/* Message Input */}
            <div class='p-4 border-t border-gray-200 bg-white'>
              <form onSubmit={sendMemberMessage} class='flex gap-2'>
                <input
                  type='text'
                  value={memberMessage()}
                  onInput={(e) => setMemberMessage(e.target.value)}
                  placeholder='Type your message to team...'
                  class='flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:bg-white transition-all text-sm'
                />
                <button
                  type='submit'
                  class='px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium'>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
