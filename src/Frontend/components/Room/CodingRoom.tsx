import { createSignal, For, Show, onMount } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import {
  FiUsers,
  FiMessageSquare,
  FiTerminal,
  FiLogOut,
  FiPlay,
  FiFile,
  FiPlus,
  FiFileText,
  FiSave,
  FiTrash2,
} from "solid-icons/fi";
import { languages } from "../../../../languages.ts";
import { userId } from "../../../context/Userdetails";
import { useRoomContext } from "../../context/RoomContext";

// import setUser from "../../../Backend/Database/SetUser.ts";
import CreateFileModal from "../../modals/createFile.tsx";
import { TeamChatModal } from "../../modals/teamChatModal.tsx";
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

        // Initialize messages with room data if available
        if (roomData.Messages && roomData.Messages.length > 0) {
          const roomMessages = roomData.Messages.map(
            (msg: any, index: number) => ({
              id: index + 1,
              sender: msg.sender || "Unknown User",
              content: msg.content || msg.message || "",
              timestamp:
                msg.timestamp ||
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            })
          );
          setMessages(roomMessages);
        } else {
          // Set welcome message with room name
          setMessages([
            {
              id: 1,
              sender: "AI Assistant",
              content: `Welcome to ${roomData.Name}! I'm here to help you with your coding. Ask me anything!`,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }

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
  const [aiMessage, setAiMessage] = createSignal("");

  const [showOutput, setShowOutput] = createSignal(false);
  const [isRunning, setIsRunning] = createSignal(false);
  const [isSaving, setIsSaving] = createSignal(false);

  const [files, setFiles] = createSignal<file_objects[]>([]);
  const [activeFileIndex, setActiveFileIndex] = createSignal(0);
  const [showCreateFileModal, setShowCreateFileModal] = createSignal(false);
  const [showMemberChatModal, setShowMemberChatModal] = createSignal(false);

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
    const activeFile = files()[activeFileIndex()];
    if (!activeFile || !activeFile.fileId) {
      return;
    }

    setIsSaving(true);
    try {
      // Clear any pending auto-save
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }

      const result = await updateFileContent(activeFile.fileId, code());
      if (result.success) {
        // Update local file's lastChanged timestamp and clear unsaved changes
        const updatedFiles = files().map((file, index) => {
          if (
            index === activeFileIndex() &&
            file.fileId === activeFile.fileId
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
    const activeFile = files()[activeFileIndex()];
    if (activeFile) {
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
      if (activeFile.fileId) {
        if (saveTimer) {
          clearTimeout(saveTimer);
        }
        saveTimer = setTimeout(() => {
          saveFileContent(activeFile.fileId!, newCode);
        }, 2000);
      }
    }
  };

  // Initialize messages from room data - use default value
  const [messages, setMessages] = createSignal([
    {
      id: 1,
      sender: "AI Assistant",
      content:
        "Welcome! I'm here to help you with your coding. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

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
    setFiles([...files(), newFile]);
    setActiveFileIndex(files().length - 1); // Switch to the new file
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
    setOutput("Compiling and executing...");

    // Check if there are files and active file exists
    const activeFile = files()[activeFileIndex()];
    if (!activeFile) {
      setOutput("Error: No active file selected");
      setIsRunning(false);
      return;
    }

    const languageMatch = languages.find(
      (lang) => lang.name === activeFile.language
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
        body: JSON.stringify({ language_id: id, source_code: code() }),
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

  return (
    <Show
      when={!loading() && !error() && hasAccess() && room()}
      fallback={
        <div class='flex items-center justify-center min-h-screen bg-gray-50'>
          <Show when={loading()}>
            <div class='text-center'>
              <div class='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse'>
                <div class='w-6 h-6 bg-blue-600 rounded-full animate-ping'></div>
              </div>
              <p class='text-lg text-gray-600'>Loading room...</p>
              <p class='text-sm text-gray-500 mt-2'>Room ID: {params.roomId}</p>
            </div>
          </Show>

          <Show when={error()}>
            <div class='text-center max-w-md mx-auto p-8'>
              <div class='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  class='w-8 h-8 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <h2 class='text-xl font-semibold text-gray-900 mb-2'>
                Access Denied
              </h2>
              <p class='text-gray-600 mb-6'>{error()}</p>
              <div class='space-y-2'>
                <button
                  onClick={() => navigate("/dashboard")}
                  class='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                  Back to Dashboard
                </button>
                <Show when={!userId()}>
                  <button
                    onClick={() => navigate("/login")}
                    class='w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'>
                    Login
                  </button>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      }>
      <div class='w-full min-w-[100vw] h-screen bg-gray-50 overflow-hidden flex flex-col'>
        {/* Room Header */}
        {room() && (
          <div class='bg-white border-b border-gray-200 px-6 py-3'>
            <div class='flex items-center justify-between'>
              <div class='flex items-center gap-4'>
                <button
                  onClick={() => navigate("/dashboard")}
                  class='flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors'>
                  <svg
                    class='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                  Back
                </button>
                <div class='h-6 w-px bg-gray-300'></div>
                <div>
                  <h1 class='text-lg font-semibold text-gray-900'>
                    {room()?.Name}
                  </h1>
                  <p class='text-sm text-gray-600'>{room()?.Description}</p>
                </div>
              </div>

              <div class='flex items-center gap-4'>
                {/* Room Info */}
                <div class='flex items-center gap-2 text-sm text-gray-600'>
                  <FiUsers class='w-4 h-4' />
                  <span>{connectedUsers().length} members</span>
                </div>

                {/* Tags */}
                <Show when={room()?.Tags?.length}>
                  <div class='flex gap-1'>
                    <For each={room()?.Tags?.slice(0, 3) || []}>
                      {(tag: string) => (
                        <span class='px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'>
                          {tag}
                        </span>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        )}

        <div class='flex flex-1 overflow-hidden'>
          {/* Left Sidebar - Users and Files */}
          <aside class='w-72 bg-white border-r border-gray-200 flex flex-col'>
            {/* Connected Users */}
            <div class='p-6 border-b border-gray-100'>
              <div class='flex items-center gap-2 mb-4'>
                <FiUsers class='text-gray-600' />
                <h2 class='text-sm font-semibold text-gray-900'>
                  Connected Users ({connectedUsers().length})
                </h2>
              </div>

              <div class='space-y-3'>
                <For each={connectedUsers()}>
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
                        class={`flex items-center justify-between p-3 rounded-lg transition-colors group ${
                          index() === activeFileIndex()
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}>
                        {/* File info section */}
                        <div
                          class='flex-1 cursor-pointer'
                          onClick={() => switchToFile(index())}>
                          <div class='flex flex-col gap-1'>
                            <div class='flex items-center gap-2'>
                              <span
                                class={`text-sm font-medium ${
                                  index() === activeFileIndex()
                                    ? "text-blue-700"
                                    : "text-gray-700"
                                }`}>
                                {file.name}
                              </span>
                              {file.hasUnsavedChanges && (
                                <div
                                  class='w-2 h-2 bg-orange-500 rounded-full'
                                  title='Unsaved changes'></div>
                              )}
                            </div>
                            {file.lastChanged && (
                              <span class='text-xs text-gray-500'>
                                Last changed:{" "}
                                {file.lastChanged.toLocaleDateString()}{" "}
                                {file.lastChanged.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                            <span class='text-xs text-gray-400'>
                              {file.language}
                            </span>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent file selection when clicking delete
                            handleDeleteFile(index());
                          }}
                          class='opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all duration-200'
                          title='Delete file'>
                          <FiTrash2 class='text-red-500 text-xs' />
                        </button>
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
                  <div class='flex items-center gap-2'>
                    <h2 class='text-lg font-semibold text-gray-900'>
                      {files().length > 0 && files()[activeFileIndex()]
                        ? files()[activeFileIndex()].name
                        : "Code Editor"}
                    </h2>
                    {files().length > 0 &&
                      files()[activeFileIndex()]?.hasUnsavedChanges && (
                        <div class='flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs'>
                          <div class='w-1.5 h-1.5 bg-orange-500 rounded-full'></div>
                          <span>Unsaved</span>
                        </div>
                      )}
                  </div>
                  <span class='text-sm text-gray-600'>
                    Room: {room()?.Name || "#Room"}
                  </span>
                </div>

                <div class='flex items-center gap-3'>
                  <button
                    class='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md'
                    onClick={() => setShowMemberChatModal(true)}>
                    <FiUsers class='text-sm' />
                    <span>Team Chat</span>
                  </button>

                  <button
                    class='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md'
                    onClick={() => {
                      navigate("/dashboard");
                    }}>
                    <FiLogOut class='text-sm' />
                    <span>Exit Room</span>
                  </button>

                  {/* Save Button */}
                  {files().length > 0 && files()[activeFileIndex()]?.fileId && (
                    <button
                      class={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-sm hover:shadow-md ${
                        isSaving()
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={handleManualSave}
                      disabled={isSaving()}
                      title='Save current file'>
                      <FiSave class='text-sm' />
                      <span>{isSaving() ? "Saving..." : "Save"}</span>
                    </button>
                  )}

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
                        updateCode(e.target.value);
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
                      Create your first file to start coding. You can create
                      files for different programming languages.
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
            {files().length > 0 ? (
              <div class='bg-gray-50 border-t border-gray-200 p-6'>
                <div class='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Input */}
                  <div class='bg-white rounded-lg border border-gray-200 shadow-sm'>
                    <div class='px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg'>
                      <div class='flex items-center gap-2'>
                        <FiTerminal class='text-gray-600 text-sm' />
                        <h3 class='text-sm font-semibold text-gray-900'>
                          Input
                        </h3>
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
                <h2 class='text-lg font-semibold text-gray-900'>
                  AI Assistant
                </h2>
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

        {/* Team Chat Modal */}
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

        <style>{`
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
    </Show>
  );
}
