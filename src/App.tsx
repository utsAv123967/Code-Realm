import { Route, Router } from "@solidjs/router";

import Login from "./Frontend/pages/Login";
import LiveCodingRoom from "./Frontend/components/Room/CodingRoom";

import Home_new from "./Frontend/pages/Home_new";
import Navbar from "./Frontend/components/General/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Route path='/' component={Home_new}></Route>
        <Route path='/login' component={Login} />
        <Route path='/room' component={LiveCodingRoom} />
      </Router>
    </>
  );
}

export default App;
