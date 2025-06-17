// import { createSignal, createContext, useContext } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Navbar from "./Frontend/components/Navbar";
import Login from "./Frontend/pages/Login";
import LiveCodingRoom from "./Frontend/components/CodingRoom";

// import { useGSAP } from "@gsap/react";
import { ThemeProvider } from "./Frontend/context/Theme_context";

import Home_new from "./Frontend/pages/Home_new";

// Home page component
// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
function App() {
  return (
    <ThemeProvider>
      {/* <Navbar /> */}
      <Router>
        <Route path='/' component={Home_new}></Route>
        <Route path='/login' component={Login} />
        <Route path='/room' component={LiveCodingRoom} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
