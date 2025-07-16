import { Route, Router } from "@solidjs/router";

import Login from "./Frontend/pages/Login";
import LiveCodingRoom from "./Frontend/components/Room/CodingRoom";

import Home_new from "./Frontend/pages/Home_new";
import Navbar from "./Frontend/components/General/Navbar";
import Dashboard from "./Frontend/components/dashboard/Dashboard";
import Test from "./Frontend/test";
function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Route path='/' component={Home_new}></Route>
        <Route path='/login' component={Login} />
        <Route path='/room' component={LiveCodingRoom} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/test' component={Test} />
      </Router>
    </>
  );
}

export default App;
