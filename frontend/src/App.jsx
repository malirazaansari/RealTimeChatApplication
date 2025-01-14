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
import { useAuthStore } from "./store/useauthstore";
import { useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <BiLoader className="animate-spin size-10" />
      </div>
    );

  return (
    <>
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
    </>
  );
};

export default App;
