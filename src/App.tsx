import { Route, Router } from "@solidjs/router";

import Login from "./Frontend/pages/Login";
import LiveCodingRoom from "./Frontend/components/Room/CodingRoom";

import Home_new from "./Frontend/pages/Home_new";
import Navbar from "./Frontend/components/General/Navbar";
import Dashboard from "./Frontend/components/dashboard/Dashboard";
import Test from "./Frontend/Test";
import ProtectedRoute from "./Frontend/components/General/ProtectedRoute";
import AuthRedirect from "./Frontend/components/General/AuthRedirect";
import { auth } from "./Backend/Database/firebase";
import { RoomProvider } from "./Frontend/context/RoomContext";
function App() {
  // Expose auth globally for debugging from root App
  if (typeof window !== "undefined") {
    (window as any).appAuth = auth;
    console.log("🚀 App: Firebase auth exposed as window.appAuth");
  }

  return (
    <>
      <Navbar />
      <Router>
        <Route path='/' component={Home_new}></Route>
        <Route
          path='/login'
          component={() => (
            <AuthRedirect redirectTo='/dashboard'>
              <Login />
            </AuthRedirect>
          )}
        />
        <Route
          path='/room'
          component={() => (
            <ProtectedRoute>
              <LiveCodingRoom />
            </ProtectedRoute>
          )}
        />
        <Route
          path='/dashboard'
          component={() => (
            <ProtectedRoute>
              <RoomProvider>
                <Dashboard />
              </RoomProvider>
            </ProtectedRoute>
          )}
        />
        <Route
          path='/rooms/:roomId'
          component={() => (
            <ProtectedRoute>
              <RoomProvider>
                <LiveCodingRoom />
              </RoomProvider>
            </ProtectedRoute>
          )}
        />
        <Route path='/test' component={Test} />
      </Router>
    </>
  );
}

export default App;
