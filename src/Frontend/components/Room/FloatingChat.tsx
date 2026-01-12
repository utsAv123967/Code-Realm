import { createSignal, Show, For, onMount, createEffect } from "solid-js";
import { FiMessageCircle, FiX, FiSend, FiUsers, FiCode, FiCopy, FiCheck } from "solid-icons/fi";
import { chatWebSocket } from "../../services/firebaseChatService";
import { getCurrentUser, getUserId } from "../../../context/Userdetails";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isAI?: boolean;
  isUser?: boolean;
}

interface FloatingChatProps {
  roomId: string;
  connectedUsers: Array<{
    name: string;
    online: boolean;
    color: string;
  }>;
  currentCode?: string;
  currentLanguage?: string;
}

const FloatingChat = (props: FloatingChatProps) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [unreadCount, setUnreadCount] = createSignal(0);
  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: 1,
      sender: "AI Assistant",
      content: "Hello! I'm your AI coding assistant. Ask me anything or use the code context button to include your current code in the conversation.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isAI: true,
    },
  ]);
  const [includeCode, setIncludeCode] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [copiedCodeId, setCopiedCodeId] = createSignal<string | null>(null);

  let messagesEndRef: HTMLDivElement | undefined;

  // Auto-scroll to bottom when new messages arrive
  createEffect(() => {
    if (messages().length > 0 && messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: "smooth" });
    }
  });

  const sendMessage = async (e: Event) => {
    e.preventDefault();
    if (!message().trim() || isLoading()) return;

    const userMessage = message().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message to chat
    const userMsg: Message = {
      id: messages().length + 1,
      sender: getCurrentUser()?.displayName || "You",
      content: userMessage,
      timestamp,
      isUser: true,
    };

    setMessages([...messages(), userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      // Send to Gemini API
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          includeCode: includeCode(),
          code: includeCode() ? props.currentCode : undefined,
          language: includeCode() ? props.currentLanguage : undefined,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend server is not responding correctly. Make sure the backend is running on port 5000.");
      }

      const data = await response.json();

      if (response.ok) {
        // Add AI response to chat
        const aiMsg: Message = {
          id: messages().length + 1,
          sender: "AI Assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isAI: true,
        };
        setMessages([...messages(), aiMsg]);
      } else {
        throw new Error(data.error || "Failed to get response from AI");
      }
    } catch (error) {
      console.error("Chat error:", error);
      
      let errorMessage = "Failed to send message";
      
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage = "Cannot connect to backend server. Please ensure:\n1. Backend is running (cd src/Backend && node index.js)\n2. Server is on port 5000\n3. Gemini API key is configured in .env";
        } else if (error.message.includes("Backend server is not responding")) {
          errorMessage = error.message;
        } else if (error.message.includes("JSON")) {
          errorMessage = "Backend returned invalid response. Make sure:\n1. Backend server is running: cd src/Backend && node index.js\n2. GEMINI_API_KEY is set in .env file";
        } else {
          errorMessage = error.message;
        }
      }
      
      // Add error message
      const errorMsg: Message = {
        id: messages().length + 1,
        sender: "System",
        content: `⚠️ Error: ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAI: true,
      };
      setMessages([...messages(), errorMsg]);
    } finally {
      setIsLoading(false);
      setIncludeCode(false); // Reset after sending
    }
  };

  const copyCodeBlock = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(blockId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const parseMessageContent = (content: string, messageId: number) => {
    // Split message by code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: Array<{ type: "text" | "code"; content: string; language?: string; id: string }> = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.slice(lastIndex, match.index),
          id: `${messageId}-text-${blockIndex}`,
        });
      }

      // Add code block
      parts.push({
        type: "code",
        content: match[2].trim(),
        language: match[1] || "plaintext",
        id: `${messageId}-code-${blockIndex}`,
      });

      lastIndex = match.index + match[0].length;
      blockIndex++;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex),
        id: `${messageId}-text-${blockIndex}`,
      });
    }

    return parts.length > 0 ? parts : [{ type: "text" as const, content, id: `${messageId}-text-0` }];
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div class='fixed bottom-6 right-6 z-50'>
        <Show
          when={!isExpanded()}
          fallback={
            /* Expanded Chat Window */
            <div class='bg-white rounded-xl shadow-2xl w-[500px] h-[600px] flex flex-col border border-gray-200 overflow-hidden'>
              {/* Header */}
              <div class='flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                <div class='flex items-center gap-2'>
                  <FiMessageCircle class='text-lg' />
                  <span class='font-medium'>AI Coding Assistant</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  class='p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors'>
                  <FiX class='text-lg' />
                </button>
              </div>

              {/* Messages Area */}
              <div class='flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3'>
                <For each={messages()}>
                  {(msg) => (
                    <div
                      class={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        class={`max-w-[85%] rounded-lg p-3 ${
                          msg.isUser
                            ? "bg-purple-600 text-white"
                            : msg.isAI
                            ? "bg-white border border-gray-200"
                            : "bg-gray-200"
                        }`}>
                        <div class='text-xs opacity-70 mb-1'>
                          {msg.sender} • {msg.timestamp}
                        </div>
                        <div class='text-sm space-y-2'>
                          <For each={parseMessageContent(msg.content, msg.id)}>
                            {(part) => (
                              <Show
                                when={part.type === "code"}
                                fallback={
                                  <div class='whitespace-pre-wrap break-words'>
                                    {part.content}
                                  </div>
                                }>
                                <div class='relative bg-gray-900 text-gray-100 rounded-md overflow-hidden'>
                                  <div class='flex items-center justify-between px-3 py-1 bg-gray-800 border-b border-gray-700'>
                                    <span class='text-xs font-mono text-gray-400'>
                                      {part.language}
                                    </span>
                                    <button
                                      onClick={() => copyCodeBlock(part.content, part.id)}
                                      class='text-xs px-2 py-1 hover:bg-gray-700 rounded flex items-center gap-1'>
                                      <Show
                                        when={copiedCodeId() === part.id}
                                        fallback={
                                          <>
                                            <FiCopy size={12} /> Copy
                                          </>
                                        }>
                                        <FiCheck size={12} /> Copied!
                                      </Show>
                                    </button>
                                  </div>
                                  <pre class='p-3 overflow-x-auto text-sm'>
                                    <code>{part.content}</code>
                                  </pre>
                                </div>
                              </Show>
                            )}
                          </For>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
                <Show when={isLoading()}>
                  <div class='flex justify-start'>
                    <div class='bg-white border border-gray-200 rounded-lg p-3 max-w-[85%]'>
                      <div class='flex items-center gap-2'>
                        <div class='w-2 h-2 bg-purple-600 rounded-full animate-bounce' style='animation-delay: 0ms'></div>
                        <div class='w-2 h-2 bg-purple-600 rounded-full animate-bounce' style='animation-delay: 150ms'></div>
                        <div class='w-2 h-2 bg-purple-600 rounded-full animate-bounce' style='animation-delay: 300ms'></div>
                      </div>
                    </div>
                  </div>
                </Show>
                <div ref={messagesEndRef}></div>
              </div>

              {/* Code Context Toggle */}
              <Show when={props.currentCode && props.currentLanguage}>
                <div class='px-4 py-2 bg-blue-50 border-t border-blue-100'>
                  <label class='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={includeCode()}
                      onChange={(e) => setIncludeCode(e.target.checked)}
                      class='w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500'
                    />
                    <FiCode class='text-blue-600' />
                    <span class='text-sm text-blue-900'>
                      Include current code ({props.currentLanguage})
                    </span>
                  </label>
                </div>
              </Show>

              {/* Input Area */}
              <form
                onSubmit={sendMessage}
                class='p-4 border-t border-gray-200 bg-white'>
                <div class='flex gap-2'>
                  <input
                    type='text'
                    value={message()}
                    onInput={(e) => setMessage(e.target.value)}
                    placeholder='Ask about your code or anything...'
                    disabled={isLoading()}
                    class='flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50'
                  />
                  <button
                    type='submit'
                    disabled={!message().trim() || isLoading()}
                    class='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors flex items-center gap-2'>
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
