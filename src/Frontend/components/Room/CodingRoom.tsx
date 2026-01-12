import { createSignal, createMemo, For, Show, onMount } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import {
  FiUsers,
  FiTerminal,
  FiLogOut,
  FiPlay,
  FiFile,
  FiPlus,
  FiFileText,
  FiSave,
  FiTrash2,
  FiArrowLeft,
} from "solid-icons/fi";
import { languages } from "../../../../languages.ts";
import MonacoEditor from "../common/MonacoEditor";
import { userId } from "../../../context/Userdetails";
import { useRoomContext } from "../../context/RoomContext";

// import setUser from "../../../Backend/Database/SetUser.ts";
import CreateFileModal from "../../modals/createFile.tsx";
import { TeamChatModal } from "../../modals/teamChatModal.tsx";
import FloatingChat from "./FloatingChat.tsx";
import {
  createFile,
  updateFileContent,
  loadFilesByIds,
  deleteFile,
} from "../../../Backend/Database/FileManager";
import type { file_objects, Room, DatabaseFile } from "../../../types.ts";

export default function CodingRoom() {
  const params = useParams();
  const navigate = useNavigate();
  const roomContext = useRoomContext();

  // Room state
  const [room, setRoom] = createSignal<Room | undefined>(
    roomContext.currentRoom()
  );
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | undefined>(undefined);
  const [hasAccess, setHasAccess] = createSignal(false);

  // Check if user has access to this room
  const checkRoomAccess = (roomData: Room): boolean => {
    const currentUserId = userId();
    if (!currentUserId) return false;

    // User can access if they created the room or are in the Users array
    const isCreator = roomData.Createdby === currentUserId;
    const isJoined = roomData.Users?.includes(currentUserId) || false;

    return isCreator || isJoined;
  };

  // Load room data using context
  const loadRoomData = async () => {
    if (!params.roomId) {
      setError("Room ID not provided");
      setLoading(false);
      return;
    }

    if (!userId()) {
      setError("You must be logged in to access rooms");
      setLoading(false);
      return;
    }

    try {
      // First check if room is already set as current room in context
      let roomData = roomContext.currentRoom();
      if (roomData && roomData.RoomId === params.roomId) {
        // Room found in context as current room
      } else {
        // Check if room is in cached rooms
        roomData = roomContext.getRoomById(params.roomId);

        // If not in cache, try to refresh context
        if (!roomData) {
          await roomContext.refreshRooms();
          roomData = roomContext.getRoomById(params.roomId);
        }
      }

      if (!roomData) {
        setError("Room not found");
        setLoading(false);
        return;
      }

      setRoom(roomData);

      // Check access
      const accessGranted = checkRoomAccess(roomData);
      setHasAccess(accessGranted);

      if (!accessGranted) {
        setError("You don't have permission to access this room");
      } else {
        // Set as current room in context for future reference
        roomContext.setCurrentRoom(roomData);

        // Initialize files from room data if available
        if (roomData.files && roomData.files.length > 0) {
          // Load actual file data from database using file IDs
          const databaseFiles = await loadFilesByIds(roomData.files);

          // Convert database files to local file format
          const roomFiles = databaseFiles.map((dbFile: DatabaseFile) => ({
            name: dbFile.name,
            body: dbFile.code,
            language: dbFile.language,
            fileId: dbFile.fileId,
            lastChanged: dbFile.lastChanged,
            roomId: dbFile.roomId,
          }));

          setFiles(roomFiles);
          if (roomFiles.length > 0) {
            setActiveFileIndex(0);
            setCode(roomFiles[0].body);
          }
        }
      }
    } catch (err) {
      setError("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    loadRoomData();

    // Add keyboard shortcut for saving (Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault(); // Prevent browser's default save
        handleManualSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  });
  // const RoomID =
  const [code, setCode] = createSignal("//write Code");
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");

  const [showOutput, setShowOutput] = createSignal(false);
  const [isRunning, setIsRunning] = createSignal(false);
  const [isSaving, setIsSaving] = createSignal(false);

  const [files, setFiles] = createSignal<file_objects[]>([]);
  const [activeFileIndex, setActiveFileIndex] = createSignal(0);
  const [showCreateFileModal, setShowCreateFileModal] = createSignal(false);
  const [showMemberChatModal, setShowMemberChatModal] = createSignal(false);

  const hasFiles = () => files().length > 0;
  const activeFile = () => files()[activeFileIndex()] ?? undefined;

  const keywordLanguageMap: Record<string, string> = {
    typescript: "typescript",
    javascript: "javascript",
    python: "python",
    "c++": "cpp",
    "c#": "csharp",
    "f#": "fsharp",
    "visual basic": "vb",
    kotlin: "kotlin",
    java: "java",
    go: "go",
    rust: "rust",
    ruby: "ruby",
    swift: "swift",
    scala: "scala",
    sql: "sql",
    php: "php",
    dart: "dart",
    julia: "julia",
    lua: "lua",
    haskell: "haskell",
    shell: "shell",
    bash: "shell",
    powershell: "powershell",
    plaintext: "plaintext",
    "plain text": "plaintext",
  };

  const extensionLanguageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cc: "cpp",
    cs: "csharp",
    go: "go",
    rs: "rust",
    rb: "ruby",
    php: "php",
    swift: "swift",
    kt: "kotlin",
    kotlin: "kotlin",
    scala: "scala",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    ps1: "powershell",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    html: "html",
    css: "css",
    scss: "scss",
    md: "markdown",
    txt: "plaintext",
  };

  const resolveEditorLanguage = (
    languageName?: string,
    fileName?: string
  ): string => {
    const fileExtension = fileName?.includes(".")
      ? fileName.split(".").pop()?.toLowerCase()
      : undefined;

    if (fileExtension && extensionLanguageMap[fileExtension]) {
      return extensionLanguageMap[fileExtension];
    }

    if (languageName) {
      const normalized = languageName.toLowerCase();
      for (const keyword in keywordLanguageMap) {
        if (normalized.includes(keyword)) {
          return keywordLanguageMap[keyword];
        }
      }

      const matchedLanguage = languages.find(
        (lang) => lang.name === languageName
      );
      if (matchedLanguage) {
        const mapped = extensionLanguageMap[matchedLanguage.extension];
        if (mapped) return mapped;
      }
    }

    return "plaintext";
  };

  const activeEditorLanguage = createMemo(() =>
    resolveEditorLanguage(activeFile()?.language, activeFile()?.name)
  );

  // Auto-save timer for file content
  let saveTimer: NodeJS.Timeout | null = null;

  // Function to save file content to database
  const saveFileContent = async (fileId: string, content: string) => {
    try {
      const result = await updateFileContent(fileId, content);
      if (result.success) {
        // Update local file's lastChanged timestamp and clear unsaved changes
        const updatedFiles = files().map((file, index) => {
          if (index === activeFileIndex() && file.fileId === fileId) {
            return {
              ...file,
              lastChanged: new Date(),
              hasUnsavedChanges: false,
            };
          }
          return file;
        });
        setFiles(updatedFiles);
      }
    } catch (error) {
      // Auto-save failed silently
    }
  };

  // Manual save function for the save button
  const handleManualSave = async () => {
    const currentFile = activeFile();
    if (!currentFile || !currentFile.fileId) {
      return;
    }

    setIsSaving(true);
    try {
      // Clear any pending auto-save
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }

      const result = await updateFileContent(currentFile.fileId, code());
      if (result.success) {
        // Update local file's lastChanged timestamp and clear unsaved changes
        const updatedFiles = files().map((file, index) => {
          if (
            index === activeFileIndex() &&
            file.fileId === currentFile.fileId
          ) {
            return {
              ...file,
              lastChanged: new Date(),
              hasUnsavedChanges: false,
            };
          }
          return file;
        });
        setFiles(updatedFiles);
      }
    } catch (error) {
      // Handle error silently or show user notification
    } finally {
      setIsSaving(false);
    }
  };

  // Enhanced setCode function with auto-save
  const updateCode = (newCode: string) => {
    setCode(newCode);

    // Update local file content
    const currentFile = activeFile();
    if (currentFile) {
      const updatedFiles = files().map((file, index) => {
        if (index === activeFileIndex()) {
          return {
            ...file,
            body: newCode,
            hasUnsavedChanges: true, // Mark as having unsaved changes
          };
        }
        return file;
      });
      setFiles(updatedFiles);

      // Auto-save to database after 2 seconds of inactivity
      if (currentFile.fileId) {
        if (saveTimer) {
          clearTimeout(saveTimer);
        }
        saveTimer = setTimeout(() => {
          saveFileContent(currentFile.fileId!, newCode);
        }, 2000);
      }
    }
  };

  // Generate connected users from room data
  const connectedUsers = () => {
    const currentRoom = room();
    if (!currentRoom) return [];

    const users = [];
    const colors = [
      "#10B981",
      "#3B82F6",
      "#8B5CF6",
      "#F59E0B",
      "#EF4444",
      "#06B6D4",
      "#84CC16",
    ];

    // Add room creator
    users.push({
      name: currentRoom.Createdby,
      online: true, // Assume creator is online
      color: colors[0],
      isCreator: true,
    });

    // Add other users
    if (currentRoom.Users) {
      currentRoom.Users.forEach((user, index) => {
        if (user !== currentRoom.Createdby) {
          // Don't add creator twice
          users.push({
            name: user,
            online: Math.random() > 0.3, // Random online status for demo
            color: colors[(index + 1) % colors.length],
            isCreator: false,
          });
        }
      });
    }

    return users;
  };

  // Empty function for creating new file - you can implement this
  const createNewFile = () => {
    setShowCreateFileModal(true);
  };

  // Add this function before the return statement in CodingRoom.tsx
  const handleCreateFile = async (fileName: string, language: string) => {
    const newFile = {
      name: fileName,
      body: getDefaultContent(language),
      language: language,
    };

    // Add file to local state first for immediate UI update
    setFiles((currentFiles) => {
      const updatedFiles = [...currentFiles, newFile];
      setActiveFileIndex(updatedFiles.length - 1); // Switch to the new file
      return updatedFiles;
    });
    setCode(newFile.body);

    // Save file to database using new file management system
    const currentRoom = room();
    const currentUserId = userId();

    if (currentRoom && params.roomId && currentUserId) {
      try {
        const result = await createFile(
          params.roomId,
          fileName,
          newFile.body,
          language,
          currentUserId
        );

        if (result.success && result.file) {
          // Update the local file with database info
          const updatedFiles = [...files()];
          const lastIndex = updatedFiles.length - 1;
          updatedFiles[lastIndex] = {
            ...updatedFiles[lastIndex],
            fileId: result.file.fileId,
            lastChanged: result.file.lastChanged,
            roomId: result.file.roomId,
          };
          setFiles(updatedFiles);

          // Update the room context with the new file ID
          const updatedRoom = {
            ...currentRoom,
            files: [...(currentRoom.files || []), result.file.fileId],
            updatedAt: new Date(),
          };
          setRoom(updatedRoom);
          roomContext.setCurrentRoom(updatedRoom);

          // Refresh room data to sync with database
          await roomContext.refreshRooms();
        }
      } catch (error) {
        // Handle error silently
      }
    }
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

  const switchToFile = (index: number) => {
    setActiveFileIndex(index);
    const file = files()[index];
    if (file) {
      setCode(file.body);
    }
  };

  // Delete file function
  const handleDeleteFile = async (fileIndex: number) => {
    const fileToDelete = files()[fileIndex];

    if (!fileToDelete || !fileToDelete.fileId || !room()?.RoomId) {
      return;
    }

    // Confirm deletion
    const confirmed = confirm(
      `Are you sure you want to delete "${fileToDelete.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      // Delete from database
      const result = await deleteFile(fileToDelete.fileId, room()!.RoomId);

      if (result.success) {
        // Remove from local state
        const updatedFiles = files().filter((_, index) => index !== fileIndex);
        setFiles(updatedFiles);

        // Update active file index if needed
        if (activeFileIndex() >= updatedFiles.length) {
          if (updatedFiles.length > 0) {
            setActiveFileIndex(updatedFiles.length - 1);
            setCode(updatedFiles[updatedFiles.length - 1].body);
          } else {
            setActiveFileIndex(-1);
            setCode("//write Code");
          }
        } else if (activeFileIndex() === fileIndex) {
          // If we deleted the active file, switch to the next one or clear
          if (updatedFiles.length > 0) {
            const newIndex =
              fileIndex >= updatedFiles.length
                ? updatedFiles.length - 1
                : fileIndex;
            setActiveFileIndex(newIndex);
            setCode(updatedFiles[newIndex].body);
          } else {
            setActiveFileIndex(-1);
            setCode("//write Code");
          }
        } else if (activeFileIndex() > fileIndex) {
          // Adjust active index if we deleted a file before the active one
          setActiveFileIndex(activeFileIndex() - 1);
        }

        // Refresh room context
        await roomContext.refreshRooms();
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setShowOutput(true);
    setOutput(""); // Clear output, let backend response populate it

    // Check if there are files and active file exists
    const currentFile = activeFile();
    if (!currentFile) {
      setOutput("Error: No active file selected");
      setIsRunning(false);
      return;
    }

    const languageMatch = languages.find(
      (lang) => lang.name === currentFile.language
    );

    if (!languageMatch) {
      setOutput("Error: Language not supported");
      setIsRunning(false);
      return;
    }

    const id = languageMatch.id;

    try {
      const res = await fetch("http://localhost:5000/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: id,
          source_code: code(),
          stdin: input(),
        }),
      });
      const result = await res.json();

      if (result.stdout == null) {
        setOutput(result.compile_output || "Compilation error occurred");
      } else {
        setOutput(result.stdout);
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const renderExecutionPanels = () => (
    <>
      <div class='rounded-2xl border border-blue-100 bg-white shadow-xl overflow-hidden'>
        <div class='flex items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white px-6 py-4'>
          <div class='flex items-center gap-3'>
            <div class='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600'>
              <FiTerminal class='text-lg' />
            </div>
            <div>
              <p class='text-sm font-semibold text-slate-800'>Custom input</p>
              <p class='text-xs text-slate-500'>Provide stdin before running your code</p>
            </div>
          </div>
        </div>
        <div class='p-6'>
          <textarea
            class='h-32 w-full rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400'
            value={input()}
            onInput={(e) => setInput(e.currentTarget.value)}
            placeholder='Enter input here...'
          />
        </div>
      </div>

      {showOutput() && (
        <div class='rounded-2xl border border-emerald-100 bg-white shadow-xl overflow-hidden text-slate-800'>
          <div class='flex items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-4'>
            <div class='flex items-center gap-3'>
              <div class='flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-100 text-emerald-600'>
                <FiTerminal class='text-lg' />
              </div>
              <div>
                <p class='text-sm font-semibold text-emerald-700'>Program output</p>
                <p class='text-xs text-emerald-500'>Live response from the compiler</p>
              </div>
            </div>
            {isRunning() && (
              <div class='flex items-center gap-2 text-xs font-medium text-emerald-500'>
                <span>Running</span>
                <div class='h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
          </div>
          <div class='p-6'>
            <pre class='h-40 w-full overflow-auto rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 font-mono text-sm leading-relaxed text-emerald-700 whitespace-pre-wrap'>
              {output()}
            </pre>
          </div>
        </div>
      )}
    </>
  );

  return (
    <Show
      when={!loading() && !error() && hasAccess() && room()}
      fallback={
        <div class='flex min-h-screen items-center justify-center bg-slate-100 px-6'>
          <Show when={loading()}>
            <div class='space-y-5 text-center'>
              <div class='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                <div class='h-8 w-8 rounded-full border-2 border-blue-500/70 border-t-transparent animate-spin'></div>
              </div>
              <div class='space-y-1'>
                <p class='text-lg font-semibold text-slate-700'>Preparing your coding room</p>
                <p class='text-sm text-slate-500'>Room ID: {params.roomId}</p>
              </div>
            </div>
          </Show>

          <Show when={error()}>
            <div class='max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl'>
              <div class='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600'>
                <svg
                  class='h-8 w-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M12 9v2m0 4h.01M4.93 19h14.14c1.5 0 2.43-1.624 1.68-2.438L13.68 4.562c-.75-.813-2.61-.813-3.36 0L3.25 16.562C2.5 17.376 3.43 19 4.93 19z'
                  />
                </svg>
              </div>
              <h2 class='mb-2 text-xl font-semibold text-slate-900'>Access denied</h2>
              <p class='mb-6 text-sm text-slate-500'>{error()}</p>
              <div class='space-y-3'>
                <button
                  onClick={() => navigate("/dashboard")}
                  class='w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500'>
                  Back to dashboard
                </button>
                <Show when={!userId()}>
                  <button
                    onClick={() => navigate("/login")}
                    class='w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600'>
                    Login
                  </button>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      }>
      <div class='flex min-h-screen min-w-[100vw] flex-col overflow-hidden bg-slate-100 pb-10'>
        {room() && (
          <div class='border-b border-slate-200 bg-gradient-to-r from-white via-blue-50/40 to-white px-6 py-6 shadow-sm backdrop-blur lg:px-12'>
            <div class='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div class='flex flex-1 flex-col gap-4 text-slate-700'>
                <div class='flex flex-wrap items-center gap-4'>
                  <button
                    onClick={() => navigate("/dashboard")}
                    class='flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 hover:shadow-sm'>
                    <FiArrowLeft class='text-base' />
                    <span>Back</span>
                  </button>
                  <span class='text-xs font-semibold uppercase tracking-[0.35em] text-slate-400'>Room Overview</span>
                </div>
                <div class='space-y-2'>
                  <h1 class='text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.2rem]'>
                    {room()?.Name}
                  </h1>
                  <p class='max-w-3xl text-sm text-slate-600 sm:text-base'>
                    {room()?.Description || "Collaborate with your team in real time."}
                  </p>
                </div>
              </div>
              <div class='flex flex-wrap items-center gap-4 text-sm'>
                <div class='rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 shadow-sm'>
                  <p class='text-xs font-semibold uppercase tracking-wide text-slate-400'>Members</p>
                  <div class='mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900'>
                    <FiUsers class='text-blue-500' />
                    <span>{connectedUsers().length}</span>
                  </div>
                </div>
                <Show when={room()?.Tags?.length}>
                  <div class='flex flex-wrap items-center gap-2'>
                    <For each={room()?.Tags?.slice(0, 3) || []}>
                      {(tag: string) => (
                        <span class='rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm'>
                          #{tag}
                        </span>
                      )}
                    </For>
                  </div>
                </Show>
                <div class='flex flex-wrap items-center gap-3'>
                  <button
                    class='flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                    onClick={() => setShowMemberChatModal(true)}>
                    <FiUsers class='text-base' />
                    <span>Team chat</span>
                  </button>
                  <button
                    class='flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-2 font-semibold text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:shadow-sm'
                    onClick={() => {
                      navigate("/dashboard");
                    }}>
                    <FiLogOut class='text-base' />
                    <span>Exit room</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div class='flex-1 overflow-hidden px-4 py-6 sm:px-6 lg:px-10'>
          <div class='grid h-full grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_360px]'>
            <aside class='flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/75 shadow-lg backdrop-blur'>
              <div class='flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-5'>
                <div>
                  <p class='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>Collaborators</p>
                  <p class='text-lg font-semibold text-slate-900'>Team overview</p>
                </div>
                <div class='flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600'>
                  <FiUsers class='text-sm' />
                  <span>{connectedUsers().length}</span>
                </div>
              </div>
              <div class='flex-1 space-y-8 overflow-y-auto px-6 py-6'>
                <section>
                  <div class='mb-4 flex items-center justify-between'>
                    <h3 class='text-xs font-semibold uppercase tracking-wide text-slate-500'>Members</h3>
                    <span class='text-xs text-slate-400'>Live presence</span>
                  </div>
                  <div class='space-y-3'>
                    <For each={connectedUsers()}>
                      {(user) => (
                        <div class='flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 shadow-sm transition hover:border-blue-200'>
                          <div
                            class={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm ${
                              user.online ? "" : "opacity-60"
                            }`}
                            style={{ "background-color": user.color }}>
                            {user.name.charAt(0)}
                          </div>
                          <div class='flex-1'>
                            <p class='text-sm font-semibold text-slate-800'>{user.name}</p>
                            <div class='mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                              <span
                                class={`h-2 w-2 rounded-full ${
                                  user.online ? "bg-emerald-500" : "bg-slate-400"
                                }`}></span>
                              <span>{user.online ? "Online now" : "Offline"}</span>
                              <Show when={user.isCreator}>
                                <span class='rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700'>Host</span>
                              </Show>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </section>

                <section>
                  <div class='mb-4 flex items-center justify-between'>
                    <div class='flex items-center gap-3'>
                      <div class='flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500'>
                        <FiFile class='text-base' />
                      </div>
                      <div>
                        <h3 class='text-sm font-semibold text-slate-700'>Project files</h3>
                        <p class='text-xs text-slate-400'>Organize your workspace</p>
                      </div>
                    </div>
                    <button
                      onClick={createNewFile}
                      class='flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 transition hover:bg-emerald-500/20'
                      title='Create new file'>
                      <FiPlus class='text-base' />
                    </button>
                  </div>

                  <Show
                    when={hasFiles()}
                    fallback={
                      <div class='rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500'>
                        <div class='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-500'>
                          <FiFileText class='text-xl' />
                        </div>
                        <p class='mb-4'>Start by creating your first collaborative file.</p>
                        <button
                          onClick={createNewFile}
                          class='inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400'>
                          <FiPlus class='text-sm' />
                          <span>Create file</span>
                        </button>
                      </div>
                    }>
                    <div class='space-y-3'>
                      <For each={files()}>
                        {(file: file_objects, index) => (
                          <div
                            class={`group flex items-center justify-between rounded-xl border px-4 py-3 transition ${
                              index() === activeFileIndex()
                                ? "border-blue-500/60 bg-blue-50/70 shadow-md"
                                : "border-slate-200 bg-white/60 hover:border-blue-300 hover:bg-blue-50/40"
                            }`}>
                            <button
                              type='button'
                              class='flex flex-1 flex-col text-left'
                              onClick={() => switchToFile(index())}>
                              <div class='flex flex-wrap items-center gap-2'>
                                <span
                                  class={`text-sm font-semibold ${
                                    index() === activeFileIndex()
                                      ? "text-blue-700"
                                      : "text-slate-800"
                                  }`}>
                                  {file.name}
                                </span>
                                <span class='rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-200'>
                                  {file.language}
                                </span>
                                <Show when={file.hasUnsavedChanges}>
                                  <span class='h-2 w-2 rounded-full bg-amber-500' title='Unsaved changes'></span>
                                </Show>
                              </div>
                              <Show when={file.lastChanged}>
                                <span class='mt-1 text-xs text-slate-500'>
                                  {file.lastChanged?.toLocaleDateString()} {file.lastChanged?.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </Show>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(index());
                              }}
                              class='ml-3 flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-500 opacity-0 transition hover:bg-rose-100 group-hover:opacity-100'
                              title='Delete file'>
                              <FiTrash2 class='text-sm' />
                            </button>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </section>
              </div>
            </aside>

            <section class='flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/85 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.15)] backdrop-blur'>
              <div class='flex flex-col gap-5 border-b border-slate-200/80 bg-white/90 px-6 py-6'>
                <div class='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                  <div class='flex flex-wrap items-center gap-3 text-slate-700'>
                    <h2 class='text-xl font-semibold tracking-tight sm:text-2xl'>
                      {activeFile()?.name || "Choose a file to start coding"}
                    </h2>
                    <Show when={activeFile()?.language}>
                      <span class='rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600'>
                        {activeFile()?.language}
                      </span>
                    </Show>
                    <Show when={activeFile()?.hasUnsavedChanges}>
                      <span class='flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-700'>
                        <span class='h-2 w-2 rounded-full bg-amber-400'></span>
                        Unsaved changes
                      </span>
                    </Show>
                  </div>
                  <div class='flex flex-wrap items-center justify-end gap-2 md:gap-3'>
                    <Show when={hasFiles() && !!activeFile()?.fileId}>
                      <button
                        class={`flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 transition ${
                          isSaving()
                            ? "cursor-not-allowed text-blue-300"
                            : "hover:border-blue-300 hover:bg-blue-100"
                        }`}
                        onClick={handleManualSave}
                        disabled={isSaving()}
                        title='Save current file (Ctrl+S)'>
                        <FiSave class='text-base' />
                        <span>{isSaving() ? "Saving" : "Save"}</span>
                      </button>
                    </Show>
                    <button
                      class={`flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-600 transition ${
                        isRunning()
                          ? "cursor-not-allowed text-emerald-300"
                          : "hover:border-emerald-300 hover:bg-emerald-100"
                      }`}
                      onClick={runCode}
                      disabled={isRunning()}>
                      <FiPlay class='text-base' />
                      <span>{isRunning() ? "Running" : "Run"}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class='relative flex-1 overflow-hidden px-6 pb-8 pt-6 flex flex-col justify-center'>
                <Show
                  when={hasFiles() && !!activeFile()}
                  fallback={
                    <div class='mx-auto flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800/40 bg-slate-900/30 px-6 py-12 text-center'>
                      <div class='mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-blue-300'>
                          <FiFileText class='text-2xl' />
                        </div>
                      <h3 class='text-xl font-semibold text-white'>No files open</h3>
                      <p class='mb-5 text-sm text-slate-400'>Select or create a file from the sidebar to launch the editor.</p>
                      <button
                        onClick={createNewFile}
                        class='inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-400'>
                        <FiPlus class='text-base' />
                        <span>Create file</span>
                      </button>
                    </div>
                  }>
                  <div class='mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-inner'>
                    <MonacoEditor
                      value={code()}
                      language={activeEditorLanguage()}
                      theme='vs-dark'
                      onChange={updateCode}
                      class='min-h-[520px] h-[560px] w-full'
                      options={{
                        padding: { top: 18, bottom: 18 },
                        lineNumbers: "on",
                        renderWhitespace: "selection",
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </Show>
              </div>

              <div class='space-y-6 px-6 pb-6 xl:hidden'>
                <Show when={hasFiles()}>{renderExecutionPanels()}</Show>
              </div>
            </section>

            <section class='hidden flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 shadow-lg backdrop-blur xl:flex'>
              <div class='border-b border-slate-200/80 bg-white/70 px-6 py-5'>
                <h3 class='text-sm font-semibold uppercase tracking-wide text-slate-700'>Execution console</h3>
                <p class='text-xs text-slate-500'>Fine-tune your input and review output</p>
              </div>
              <div class='flex-1 overflow-y-auto px-6 py-6'>
                <Show
                  when={hasFiles()}
                  fallback={
                    <div class='rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500'>
                      Open or create a file to configure stdin and inspect compiler responses.
                    </div>
                  }>
                  <div class='space-y-6'>{renderExecutionPanels()}</div>
                </Show>
              </div>
            </section>
          </div>
        </div>

        {showCreateFileModal() && (
          <CreateFileModal
            isOpen={showCreateFileModal()}
            onClose={() => setShowCreateFileModal(false)}
            onCreateFile={handleCreateFile}
            languages={languages}
          />
        )}

        <TeamChatModal
          isOpen={showMemberChatModal()}
          onClose={() => setShowMemberChatModal(false)}
          roomId={params.roomId || ""}
          connectedUsers={connectedUsers().map((user: any) => ({
            name: user.name,
            online: user.online,
            color: user.color,
          }))}
        />

        <FloatingChat
          roomId={params.roomId || ""}
          connectedUsers={connectedUsers()}
          currentCode={code()}
          currentLanguage={activeFile()?.language || "javascript"}
        />

        <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

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

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
      </div>
    </Show>
  );
}
