import {
  getCurrentUser,
  getUserId,
  getIsLoading,
} from "../../../context/Userdetails";
import { auth } from "../../../Backend/Database/firebase";
import { createSignal, onMount } from "solid-js";

const AuthDebugPanel = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [debugInfo, setDebugInfo] = createSignal<any>({});

  const refreshDebugInfo = () => {
    const user = getCurrentUser();
    const userId = getUserId();
    const isLoading = getIsLoading();

    setDebugInfo({
      solidUser: user,
      userId,
      isLoading,
      firebaseUser: auth.currentUser,
      firebaseUid: auth.currentUser?.uid,
      firebaseEmail: auth.currentUser?.email,
      firebaseDisplayName: auth.currentUser?.displayName,
      isAuthenticated: !!auth.currentUser,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  onMount(() => {
    refreshDebugInfo();
    // Refresh every 2 seconds
    const interval = setInterval(refreshDebugInfo, 2000);
    return () => clearInterval(interval);
  });

  return (
    <div class='fixed bottom-4 right-4 z-50'>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible())}
        class='bg-purple-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-purple-600 mb-2'>
        🔍 Auth Debug
      </button>

      {/* Debug Panel */}
      {isVisible() && (
        <div class='bg-gray-900 text-green-400 p-4 rounded-lg shadow-xl max-w-md text-xs font-mono'>
          <div class='flex justify-between items-center mb-2'>
            <h3 class='text-white font-bold'>Auth Status</h3>
            <button
              onClick={refreshDebugInfo}
              class='bg-blue-500 text-white px-2 py-1 rounded text-xs'>
              Refresh
            </button>
          </div>

          <div class='space-y-1'>
            <div
              class={`font-bold ${
                debugInfo().isAuthenticated ? "text-green-400" : "text-red-400"
              }`}>
              Status:{" "}
              {debugInfo().isAuthenticated
                ? "✅ LOGGED IN"
                : "❌ NOT LOGGED IN"}
            </div>

            <div class='text-gray-300'>
              Last Update: {debugInfo().timestamp}
            </div>

            <div class='border-t border-gray-700 pt-2 mt-2'>
              <div class='text-yellow-400 font-bold'>SolidJS State:</div>
              <div>User: {debugInfo().solidUser ? "✅" : "❌"}</div>
              <div>User ID: {debugInfo().userId || "null"}</div>
              <div>Loading: {debugInfo().isLoading ? "true" : "false"}</div>
            </div>

            <div class='border-t border-gray-700 pt-2 mt-2'>
              <div class='text-orange-400 font-bold'>Firebase Auth:</div>
              <div>User: {debugInfo().firebaseUser ? "✅" : "❌"}</div>
              <div>UID: {debugInfo().firebaseUid || "null"}</div>
              <div>Email: {debugInfo().firebaseEmail || "null"}</div>
              <div>Name: {debugInfo().firebaseDisplayName || "null"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugPanel;
