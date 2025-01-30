import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Setting from "./pages/Setting";
import ProfileUpdate from "./pages/ProfileUpdate";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers, connectSocket } =
    useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authUser) return;
    console.log({ authUser });
    connectSocket();
  }, [authUser, connectSocket]);
  console.log("Auth User State:", authUser);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <BiLoader className="animate-spin size-10" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={authUser ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={authUser ? <Setting /> : <Navigate to="/login" />}
          />
          <Route
            path="/profileupdate"
            element={authUser ? <ProfileUpdate /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
};

export default App;
