import { createSignal, For } from "solid-js";
import {
  FiUsers,
  FiMessageSquare,
  FiTerminal,
  FiCode,
  FiChevronDown,
  FiLogOut,
  FiClock,
  FiPlay,
  FiFile,
  FiPlus,
  FiFileText,
} from "solid-icons/fi";
import { languages } from "../../../../languages.ts";

// import setUser from "../../../Backend/Database/SetUser.ts";
import CreateFileModal from "../../modals/createFile.tsx";
import type { file_objects } from "../../../types.ts";

export default function CodeRealm() {
  const [selectedLanguage, setSelectedLanguage] = createSignal(
    languages[0].name
  );
  const [code, setCode] = createSignal("//write Code");
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  const [aiMessage, setAiMessage] = createSignal("");
  const [showLanguageDropdown, setShowLanguageDropdown] = createSignal(false);
  const [showOutput, setShowOutput] = createSignal(false);
  const [isRunning, setIsRunning] = createSignal(false);

  const [files, setFiles] = createSignal<file_objects[]>([]);
  const [activeFileIndex, setActiveFileIndex] = createSignal(0);
  const [showCreateFileModal, setShowCreateFileModal] = createSignal(false);
  const [messages, setMessages] = createSignal([
    {
      id: 1,
      sender: "AI Assistant",
      content: "Hello! I'm here to help you with your coding. Ask me anything!",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "You",
      content: "How can I optimize this algorithm?",
      timestamp: "10:31 AM",
    },
    {
      id: 3,
      sender: "AI Assistant",
      content:
        "I can help you optimize your algorithm. Could you share the specific code you'd like me to review?",
      timestamp: "10:32 AM",
    },
  ]);

  const connectedUsers = [
    { name: "Utsav", online: true, color: "#10B981" },
    { name: "Raj", online: true, color: "#3B82F6" },
    { name: "Aman", online: true, color: "#8B5CF6" },
    { name: "Gaurav", online: false, color: "#F59E0B" },
    { name: "Ravi", online: false, color: "#EF4444" },
  ];

  // Empty function for creating new file - you can implement this
  const createNewFile = () => {
    console.log("Create new file clicked");
    setShowCreateFileModal(true);
  };

  // Add this function before the return statement in CodingRoom.tsx
  const handleCreateFile = (fileName: string, language: string) => {
    const newFile = {
      name: fileName,
      body: getDefaultContent(language),
      language: language,
    };

    setFiles([...files(), newFile]);
    setActiveFileIndex(files().length); // Switch to the new file
    setCode(newFile.body);
    console.log("File created:", newFile);
  };

  // Helper function to get default content based on language
  const getDefaultContent = (language: any) => {
    if (language.includes("JavaScript")) {
      return "console.log('Hello World!');";
    } else if (language.includes("Python")) {
      return "print('Hello World!')";
    } else if (language.includes("C++")) {
      return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`;
    } else if (language.includes("Java")) {
      return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`;
    } else if (language.includes("C") && !language.includes("C++")) {
      return `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`;
    }
    return "// Start coding here...";
  };

  // Empty function for switching between files - you can implement this
  const switchToFile = (index: number) => {
    setActiveFileIndex(index);
    const file = files()[index];
    if (file) {
      setCode(file.body);
      setSelectedLanguage(file.language);
    }
    console.log("Switch to file index:", index);
  };

  const runCode = async () => {
    setIsRunning(true);
    setShowOutput(true);
    setOutput("Compiling and executing...");

    const id = languages.filter((lang) => lang.name === selectedLanguage())[0]
      ?.id;

    try {
      const res = await fetch("http://localhost:5000/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language_id: id, source_code: code() }),
      });
      const result = await res.json();

      if (result.stdout == null) {
        setOutput(result.compile_output || "Compilation error occurred");
      } else {
        setOutput(result.stdout);
      }
    } catch (error: any) {
      console.log("Error running code:", error);
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const sendAiMessage = (e: Event) => {
    e.preventDefault();
    if (aiMessage().trim() === "") return;

    const newMsg = {
      id: messages().length + 1,
      sender: "You",
      content: aiMessage(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages(), newMsg]);
    setAiMessage("");

    setTimeout(() => {
      const aiResponse = {
        id: messages().length + 2,
        sender: "AI Assistant",
        content:
          "I see you're working with that code. Let me know if you need more specific help.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages(), aiResponse]);
    }, 1000);
  };

  const autoResize = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  };

  return (
    <div class='w-screen h-screen bg-gray-50 overflow-hidden flex flex-col'>
      {/* Header */}
      <header class='bg-white border-b border-gray-200 px-6 py-4 shadow-sm'>
        <div class='flex items-center justify-between'>
          <div class='flex items-center gap-4'>
            <div class='flex items-center gap-2'>
              <FiCode class='text-blue-600 text-xl' />
              <h1 class='text-xl font-bold text-gray-900'>CodeRealm</h1>
            </div>
            <div class='h-6 w-px bg-gray-300'></div>
            <span class='text-sm text-gray-600'>Room: #Algorithm-Practice</span>
          </div>

          <button class='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
            <FiLogOut class='text-sm' />
            <span class='text-sm font-medium'>Exit Room</span>
          </button>
        </div>
      </header>

      <div class='flex flex-1 overflow-hidden'>
        {/* Left Sidebar - Users and Files */}
        <aside class='w-72 bg-white border-r border-gray-200 flex flex-col'>
          {/* Connected Users */}
          <div class='p-6 border-b border-gray-100'>
            <div class='flex items-center gap-2 mb-4'>
              <FiUsers class='text-gray-600' />
              <h2 class='text-sm font-semibold text-gray-900'>
                Connected Users ({connectedUsers.length})
              </h2>
            </div>

            <div class='space-y-3'>
              <For each={connectedUsers}>
                {(user) => (
                  <div class='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50'>
                    <div
                      class={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        user.online ? "" : "opacity-50"
                      }`}
                      style={{ "background-color": user.color }}>
                      {user.name.charAt(0)}
                    </div>
                    <div class='flex-1'>
                      <span class='text-sm font-medium text-gray-900'>
                        {user.name}
                      </span>
                      <div class='flex items-center gap-2 mt-1'>
                        <div
                          class={`w-2 h-2 rounded-full ${
                            user.online ? "bg-green-500" : "bg-gray-400"
                          }`}></div>
                        <span class='text-xs text-gray-500'>
                          {user.online ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Files Section */}
          <div class='flex-1 p-6'>
            <div class='flex items-center justify-between mb-4'>
              <div class='flex items-center gap-2'>
                <FiFile class='text-gray-600' />
                <h3 class='text-sm font-semibold text-gray-900'>
                  Project Files
                </h3>
              </div>
              <button
                onClick={createNewFile}
                class='p-2 hover:bg-gray-100 rounded-lg transition-colors group'
                title='Create new file'>
                <FiPlus class='text-gray-600 text-sm group-hover:text-blue-600' />
              </button>
            </div>

            {/* Show files if any exist */}
            {files().length > 0 ? (
              <div class='space-y-2'>
                <For each={files()}>
                  {(file: file_objects, index) => (
                    <div
                      onClick={() => switchToFile(index())}
                      class={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index() === activeFileIndex()
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}>
                      <span
                        class={`text-sm font-medium ${
                          index() === activeFileIndex()
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}>
                        {file.name}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            ) : (
              /* Show empty state when no files */
              <div class='flex flex-col items-center justify-center py-8 text-center'>
                <div class='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <FiFileText class='text-gray-400 text-2xl' />
                </div>
                <p class='text-sm text-gray-500 mb-3'>No files yet</p>
                <button
                  onClick={createNewFile}
                  class='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                  <FiPlus class='text-sm' />
                  <span>Create File</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main class='flex-1 flex flex-col overflow-hidden'>
          {/* Code Editor Header */}
          <div class='bg-white border-b border-gray-200 px-6 py-4'>
            <div class='flex items-center justify-between'>
              <div class='flex items-center gap-4'>
                <h2 class='text-lg font-semibold text-gray-900'>
                  {files().length > 0 && files()[activeFileIndex()]
                    ? files()[activeFileIndex()].name
                    : "Code Editor"}
                </h2>

                {/* Language Selector */}
                <div class='relative'>
                  <button
                    onClick={() =>
                      setShowLanguageDropdown(!showLanguageDropdown())
                    }
                    class='px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm'>
                    <span class='text-gray-700 font-medium'>
                      {selectedLanguage()}
                    </span>
                    <FiChevronDown class='text-gray-500' />
                  </button>

                  {showLanguageDropdown() && (
                    <div class='absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-64 max-h-60 overflow-y-auto'>
                      <For each={languages}>
                        {(lang) => (
                          <button
                            class='block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700'
                            onClick={() => {
                              setSelectedLanguage(lang.name);
                              setShowLanguageDropdown(false);
                            }}>
                            {lang.name}
                          </button>
                        )}
                      </For>
                    </div>
                  )}
                </div>
              </div>

              <button
                class={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  isRunning()
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
                }`}
                onClick={runCode}
                disabled={isRunning()}>
                <FiPlay class='text-sm' />
                <span>{isRunning() ? "Running..." : "Run Code"}</span>
              </button>
            </div>
          </div>
          {/* Code Editor */}
          <div class='flex-1 p-6'>
            {files().length > 0 ? (
              /* Show code editor when files exist */
              <div class='h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
                <div class='h-full p-4'>
                  <textarea
                    class='w-full h-full bg-transparent resize-none outline-none text-gray-800 font-mono text-base leading-relaxed'
                    value={code()}
                    onInput={(e) => {
                      setCode(e.target.value);
                    }}
                    placeholder='// Start coding here...'
                    spellcheck={false}
                  />
                </div>
              </div>
            ) : (
              /* Show create file prompt in center when no files */
              <div class='h-full bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center'>
                <div class='text-center'>
                  <div class='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <FiFileText class='text-gray-400 text-4xl' />
                  </div>
                  <h3 class='text-lg font-semibold text-gray-900 mb-2'>
                    No files open
                  </h3>
                  <p class='text-gray-500 mb-6 max-w-sm'>
                    Create your first file to start coding. You can create files
                    for different programming languages.
                  </p>
                  <button
                    onClick={createNewFile}
                    class='flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto'>
                    <FiPlus class='text-sm' />
                    <span>Create Your First File</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {showCreateFileModal() ? (
            <CreateFileModal
              isOpen={showCreateFileModal()}
              onClose={() => setShowCreateFileModal(false)}
              onCreateFile={handleCreateFile}
              languages={languages}
            />
          ) : null}
          {/* Input/Output Section */}
          {files().length > 0 ? (
            <div class='bg-gray-50 border-t border-gray-200 p-6'>
              <div class='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Input */}
                <div class='bg-white rounded-lg border border-gray-200 shadow-sm'>
                  <div class='px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg'>
                    <div class='flex items-center gap-2'>
                      <FiTerminal class='text-gray-600 text-sm' />
                      <h3 class='text-sm font-semibold text-gray-900'>Input</h3>
                    </div>
                  </div>
                  <div class='p-4'>
                    <textarea
                      class='w-full h-32 bg-transparent resize-none outline-none text-gray-800 font-mono text-sm leading-relaxed'
                      value={input()}
                      onInput={(e) => setInput(e.target.value)}
                      placeholder='Enter input here...'
                    />
                  </div>
                </div>

                {/* Output */}
                {showOutput() && (
                  <div class='bg-white rounded-lg border border-gray-200 shadow-sm'>
                    <div class='px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg'>
                      <div class='flex items-center gap-2'>
                        <FiTerminal class='text-gray-600 text-sm' />
                        <h3 class='text-sm font-semibold text-gray-900'>
                          Output
                        </h3>
                        {isRunning() && (
                          <div class='ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                        )}
                      </div>
                    </div>
                    <div class='p-4'>
                      <pre class='w-full h-32 bg-transparent text-gray-800 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-auto'>
                        {output()}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </main>

        {/* AI Assistant - Right Panel */}
        <aside class='w-80 bg-white border-l border-gray-200 flex flex-col'>
          <div class='px-6 py-4 border-b border-gray-100 bg-blue-50'>
            <div class='flex items-center gap-2'>
              <FiMessageSquare class='text-blue-600' />
              <h2 class='text-lg font-semibold text-gray-900'>AI Assistant</h2>
            </div>
          </div>

          <div class='flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50'>
            <For each={messages()}>
              {(message) => (
                <div
                  class={`p-4 rounded-lg ${
                    message.sender === "AI Assistant"
                      ? "bg-blue-100 border border-blue-200 ml-2"
                      : "bg-white border border-gray-200 mr-2 shadow-sm"
                  }`}>
                  <div class='flex justify-between items-center mb-2'>
                    <span
                      class={`font-semibold text-sm ${
                        message.sender === "AI Assistant"
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}>
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
              )}
            </For>
          </div>

          <div class='p-4 border-t border-gray-200 bg-white'>
            <form onSubmit={sendAiMessage} class='flex gap-2'>
              <input
                type='text'
                value={aiMessage()}
                onInput={(e) => setAiMessage(e.target.value)}
                placeholder='Ask AI for help...'
                class='flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all text-sm'
              />
              <button
                type='submit'
                class='px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm'>
                <svg
                  class='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  />
                </svg>
              </button>
            </form>
          </div>
        </aside>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        * {
          font-family: "Inter", sans-serif;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
