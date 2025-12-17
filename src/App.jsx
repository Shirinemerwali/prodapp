import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Start from "./pages/Start";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";
import Habits from "./pages/Habits";

import { getCurrentUser, logout as apiLogout } from "./utils/storage";
import Events from "./pages/Events";

function RequireAuth({ isLoggedIn, children }) {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function Layout({ isLoggedIn, currentUser, onLogout, onLogin }) {
  const location = useLocation();

  const hideNavbarOn = ["/", "/login", "/signup"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname) || !isLoggedIn;

  return (
    <>
      {!shouldHideNavbar && <Navbar user={currentUser} onLogout={onLogout} />}

      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Start />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={onLogin} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup onLogin={onLogin} />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/todos"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Todos />
            </RequireAuth>
          }
        />
        <Route
          path="/habits"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Habits />
            </RequireAuth>
          }
        />
        <Route
          path="/events"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Events />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
      </Routes>
    </>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setIsLoggedIn(Boolean(user));
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, []);

  function handleLogin(user) {
    setCurrentUser(user);
    setIsLoggedIn(true);
  }

  async function handleLogout() {
    await apiLogout();
    setCurrentUser(null);
    setIsLoggedIn(false);
  }

  return (
    <Router>
      {isAuthLoading ? null : (
        <Layout
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />
      )}
    </Router>
  );
}

export default App;
