import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";
import Habits from "./pages/Habits";
import Events from "./pages/Events";

function Layout({ isLoggedIn }) {
  const location = useLocation();

  const hideNavbarOn = ["/"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname) || !isLoggedIn;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {!isLoggedIn && <Route path="/" element={<Home />} />}

        {isLoggedIn && <Route path="/" element={<Dashboard />} />}

        {isLoggedIn && (
          <>
            <Route path="/todos" element={<Todos />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/events" element={<Events />} />
          </>
        )}

        {!isLoggedIn && <Route path="*" element={<Home />} />}
      </Routes>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Layout isLoggedIn={true} />
    </Router>
  );
}

export default App;
