import { Route, Router } from "@solidjs/router";

import Login from "./Frontend/pages/Login";
import LiveCodingRoom from "./Frontend/components/Room/CodingRoom";

import Home_new from "./Frontend/pages/Home_new";
import Navbar from "./Frontend/components/General/Navbar";
import Dashboard from "./Frontend/components/dashboard/Dashboard";
import ProtectedRoute from "./Frontend/components/General/ProtectedRoute";
import AuthRedirect from "./Frontend/components/General/AuthRedirect";
import { RoomProvider } from "./context/RoomContext";
function App() {
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
      </Router>
    </>
  );
}

export default App;
