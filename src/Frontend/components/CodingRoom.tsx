import { createSignal, For } from "solid-js";
import {
  FiUsers,
  FiMessageSquare,
  FiTerminal,
  FiCode,
  FiChevronDown,
  FiLogOut,
  FiClock,
} from "solid-icons/fi";
const languages = [
  {
    id: 45,
    name: "Assembly (NASM 2.14.02)",
  },
  {
    id: 46,
    name: "Bash (5.0.0)",
  },
  {
    id: 47,
    name: "Basic (FBC 1.07.1)",
  },
  {
    id: 104,
    name: "C (Clang 18.1.8)",
  },
  {
    id: 110,
    name: "C (Clang 19.1.7)",
  },
  {
    id: 75,
    name: "C (Clang 7.0.1)",
  },
  {
    id: 76,
    name: "C++ (Clang 7.0.1)",
  },
  {
    id: 103,
    name: "C (GCC 14.1.0)",
  },
  {
    id: 105,
    name: "C++ (GCC 14.1.0)",
  },
  {
    id: 48,
    name: "C (GCC 7.4.0)",
  },
  {
    id: 52,
    name: "C++ (GCC 7.4.0)",
  },
  {
    id: 49,
    name: "C (GCC 8.3.0)",
  },
  {
    id: 53,
    name: "C++ (GCC 8.3.0)",
  },
  {
    id: 50,
    name: "C (GCC 9.2.0)",
  },
  {
    id: 54,
    name: "C++ (GCC 9.2.0)",
  },
  {
    id: 86,
    name: "Clojure (1.10.1)",
  },
  {
    id: 51,
    name: "C# (Mono 6.6.0.161)",
  },
  {
    id: 77,
    name: "COBOL (GnuCOBOL 2.2)",
  },
  {
    id: 55,
    name: "Common Lisp (SBCL 2.0.0)",
  },
  {
    id: 90,
    name: "Dart (2.19.2)",
  },
  {
    id: 56,
    name: "D (DMD 2.089.1)",
  },
  {
    id: 57,
    name: "Elixir (1.9.4)",
  },
  {
    id: 58,
    name: "Erlang (OTP 22.2)",
  },
  {
    id: 44,
    name: "Executable",
  },
  {
    id: 87,
    name: "F# (.NET Core SDK 3.1.202)",
  },
  {
    id: 59,
    name: "Fortran (GFortran 9.2.0)",
  },
  {
    id: 60,
    name: "Go (1.13.5)",
  },
  {
    id: 95,
    name: "Go (1.18.5)",
  },
  {
    id: 106,
    name: "Go (1.22.0)",
  },
  {
    id: 107,
    name: "Go (1.23.5)",
  },
  {
    id: 88,
    name: "Groovy (3.0.3)",
  },
  {
    id: 61,
    name: "Haskell (GHC 8.8.1)",
  },
  {
    id: 96,
    name: "JavaFX (JDK 17.0.6, OpenJFX 22.0.2)",
  },
  {
    id: 91,
    name: "Java (JDK 17.0.6)",
  },
  {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
  },
  {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
  },
  {
    id: 93,
    name: "JavaScript (Node.js 18.15.0)",
  },
  {
    id: 97,
    name: "JavaScript (Node.js 20.17.0)",
  },
  {
    id: 102,
    name: "JavaScript (Node.js 22.08.0)",
  },
  {
    id: 78,
    name: "Kotlin (1.3.70)",
  },
  {
    id: 111,
    name: "Kotlin (2.1.10)",
  },
  {
    id: 64,
    name: "Lua (5.3.5)",
  },
  {
    id: 89,
    name: "Multi-file program",
  },
  {
    id: 79,
    name: "Objective-C (Clang 7.0.1)",
  },
  {
    id: 65,
    name: "OCaml (4.09.0)",
  },
  {
    id: 66,
    name: "Octave (5.1.0)",
  },
  {
    id: 67,
    name: "Pascal (FPC 3.0.4)",
  },
  {
    id: 85,
    name: "Perl (5.28.1)",
  },
  {
    id: 68,
    name: "PHP (7.4.1)",
  },
  {
    id: 98,
    name: "PHP (8.3.11)",
  },
  {
    id: 43,
    name: "Plain Text",
  },
  {
    id: 69,
    name: "Prolog (GNU Prolog 1.4.5)",
  },
  {
    id: 70,
    name: "Python (2.7.17)",
  },
  {
    id: 92,
    name: "Python (3.11.2)",
  },
  {
    id: 100,
    name: "Python (3.12.5)",
  },
  {
    id: 109,
    name: "Python (3.13.2)",
  },
  {
    id: 71,
    name: "Python (3.8.1)",
  },
  {
    id: 80,
    name: "R (4.0.0)",
  },
  {
    id: 99,
    name: "R (4.4.1)",
  },
  {
    id: 72,
    name: "Ruby (2.7.0)",
  },
  {
    id: 73,
    name: "Rust (1.40.0)",
  },
  {
    id: 108,
    name: "Rust (1.85.0)",
  },
  {
    id: 81,
    name: "Scala (2.13.2)",
  },
  {
    id: 82,
    name: "SQL (SQLite 3.27.2)",
  },
  {
    id: 83,
    name: "Swift (5.2.3)",
  },
  {
    id: 74,
    name: "TypeScript (3.7.4)",
  },
  {
    id: 94,
    name: "TypeScript (5.0.3)",
  },
  {
    id: 101,
    name: "TypeScript (5.6.2)",
  },
  {
    id: 84,
    name: "Visual Basic.Net (vbnc 0.0.0.5943)",
  },
];

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
    { name: "Utsav", online: true, color: "#FF5733" },
    { name: "Raj", online: true, color: "#33FF57" },
    { name: "Aman", online: true, color: "#3357FF" },
    { name: "Gaurav", online: false, color: "#F3FF33" },
    { name: "Ravi", online: false, color: "#FF33F5" },
  ];

  const files = ["1) A.cpp", "2) A.cpp", "3) A.cpp", "4) A.cpp"];

  const runCode = async () => {
    setOutput("Code executed successfully!");
    setOutput(
      `Running ${
        languages.filter((lang) => lang.name === selectedLanguage())[0]?.name ||
        "Unknown Language"
      } code...\n> 55`
    );
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
      setShowOutput(true);
      if (result.stdout == null) setOutput(result.compile_output);
      else setOutput(result.stdout);
    } catch (error: any) {
      console.log("Error running code:", error);
      setOutput(`Error: ${error.message}`);
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

  // Auto-resize textarea function
  const autoResize = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  };

  return (
    <div class='w-screen h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex flex-col'>
      <div class='flex flex-1 overflow-hidden'>
        {/* Left Sidebar */}
        <aside class='w-[18vw] bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 flex flex-col'>
          <div class='p-6'>
            <div class='flex items-center gap-3 mb-6'>
              <FiUsers />
              <h2 class='text-sm font-semibold montserrat text-slate-700'>
                Connected Users
              </h2>
            </div>

            <div class='space-y-3 mb-8'>
              <For each={connectedUsers}>
                {(user) => (
                  <div class='flex items-center gap-3'>
                    <div
                      class={`w-3 h-3 rounded-full ${
                        user.online ? "animate-pulse" : ""
                      }`}
                      style={{ "background-color": user.color }}></div>
                    <span class='text-sm text-slate-600 montserrat'>
                      {user.name}
                    </span>
                    <span
                      class={`ml-2 w-2 h-2 rounded-full ${
                        user.online ? "bg-green-500" : "bg-gray-400"
                      }`}></span>
                  </div>
                )}
              </For>
            </div>

            <button class='w-20 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium montserrat hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg'>
              Exit
            </button>
          </div>

          <div class='bg-gradient-to-r from-slate-200 to-slate-300 border-y border-slate-300 px-6 py-3'>
            <h3 class='text-lg font-semibold montserrat text-slate-800'>
              Files
            </h3>
          </div>

          <div class='p-6 space-y-3 overflow-y-auto'>
            <For each={files}>
              {(file) => (
                <div class='text-lg font-medium montserrat text-slate-700 hover:text-orange-500 cursor-pointer transition-colors'>
                  {file}
                </div>
              )}
            </For>
          </div>
        </aside>

        {/* Main Content */}
        <main class='flex-1 p-6 overflow-auto'>
          {/* Code Editor Section */}
          <section class='bg-white/70 backdrop-blur rounded-3xl shadow-2xl p-8 mb-8 border border-white/20'>
            <div class='flex items-center justify-between mb-6'>
              <div class='flex items-center gap-2'>
                <FiCode />
                <h2 class='text-2xl font-bold text-orange-500 montserrat'>
                  Code Editor
                </h2>

                {/* Language Selector */}
                <div class='relative ml-4'>
                  <button
                    onClick={() =>
                      setShowLanguageDropdown(!showLanguageDropdown())
                    }
                    class='px-4 py-2 bg-white/80 border border-slate-300 rounded-lg flex items-center gap-2 hover:bg-white transition-colors'>
                    <span class='text-slate-700 montserrat'>
                      {selectedLanguage()}
                    </span>
                    <FiChevronDown />
                  </button>

                  {showLanguageDropdown() && (
                    <div class='absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-10 min-w-full max-h-[200px] overflow-y-auto'>
                      <For each={languages}>
                        {(lang) => (
                          <button
                            class='block w-full px-4 py-2 text-left hover:bg-slate-50 montserrat text-slate-700'
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
                class='px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-semibold montserrat hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg'
                onClick={runCode}>
                RUN CODE
              </button>
            </div>

            <div class='bg-slate-100 rounded-2xl p-4'>
              <textarea
                class='w-full  bg-transparent resize-none outline-none text-slate-700 font-mono text-lg'
                value={code()}
                onInput={(e) => {
                  setCode(e.target.value);
                  autoResize(e);
                }}
                placeholder='//write your code here...'
                style='height: auto; overflow: hidden;'
              />
            </div>
          </section>

          {/* Input/Output Section */}
          <div class='flex  justify-center gap-18'>
            {/* Input */}
            <section class='w-[25vw] bg-white/70 backdrop-blur rounded-3xl shadow-2xl p-4 border border-white/20'>
              <div class='flex items-center gap-2 mb-2'>
                <FiTerminal />
                <h3 class='text-xl font-bold text-orange-500 montserrat'>
                  Input
                </h3>
              </div>
              <div class='bg-slate-100 rounded-xl p-2'>
                <textarea
                  class='w-full min-h-[20vh] bg-transparent resize-none outline-none text-slate-700 font-mono'
                  value={input()}
                  onInput={(e) => {
                    setInput(e.target.value);
                    autoResize(e);
                  }}
                  placeholder='Enter input here...'
                  style='height: auto; overflow: hidden;'
                />
              </div>
            </section>
            {/* Output */}
            {showOutput() && (
              <section class='bg-white/70 backdrop-blur rounded-3xl shadow-2xl p-4 border border-white/20'>
                <div class='flex items-center gap-2 mb-2'>
                  <FiTerminal />
                  <h3 class='text-xl font-bold text-orange-500 montserrat'>
                    Output
                  </h3>
                </div>
                <div class='bg-slate-100 rounded-xl p-2'>
                  <textarea
                    readOnly
                    class='w-[25vw] h-auto  bg-transparent resize-none outline-none text-slate-700 font-mono'
                    value={output()}
                    onInput={(e) => {
                      setOutput(e.target.value);
                      autoResize(e);
                    }}
                    placeholder='Output will appear here...'
                    style='height: auto; '
                  />
                </div>
              </section>
            )}
          </div>
        </main>

        {/* AI Assistant - Right Panel */}
        <aside class='w-[20vw] bg-gradient-to-b from-blue-50 to-indigo-100 border-l border-slate-200 flex flex-col pr-3'>
          <div class='p-6 border-b border-slate-200'>
            <div class='flex items-center gap-3'>
              <FiMessageSquare />
              <h2 class='text-xl font-bold text-slate-800 montserrat'>
                AI ASSISTANT
              </h2>
            </div>
          </div>

          <div class='flex-1 p-6 space-y-4 overflow-y-auto'>
            <For each={messages()}>
              {(message) => (
                <div
                  class={`p-3 rounded-xl ${
                    message.sender === "AI Assistant"
                      ? "bg-blue-100/80 backdrop-blur border border-blue-200"
                      : "bg-slate-200/80 backdrop-blur border border-slate-300"
                  }`}>
                  <div class='flex justify-between items-center mb-1'>
                    <span class='font-semibold text-sm'>{message.sender}</span>
                    <span class='text-xs opacity-75'>{message.timestamp}</span>
                  </div>
                  <p class='text-slate-800 mt-2'>{message.content}</p>
                </div>
              )}
            </For>
          </div>

          <div class='p-6 border-t border-slate-200'>
            <form onSubmit={sendAiMessage} class='flex gap-2'>
              <input
                type='text'
                value={aiMessage()}
                onInput={(e) => setAiMessage(e.target.value)}
                placeholder='Type your message...'
                class='flex-1 px-4 py-3 bg-white/80 border border-slate-300 rounded-xl outline-none focus:border-blue-400 transition-colors montserrat'
              />
              <button
                type='submit'
                class='px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg'>
                <svg
                  class='w-5 h-5'
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
        .montserrat {
          font-family: "Montserrat", sans-serif;
        }

        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap");

        * {
          font-family: "Inter", sans-serif;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Auto-resize textareas */
        textarea {
          min-height: 20vh;
          transition: height 0.2s ease;
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
}
