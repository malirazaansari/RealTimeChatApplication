import { useState } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import SelectedChat from "../components/SelectedChat";
import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import { useAuthStore } from "../store/useAuthStore";

const Dashboard = () => {
  const { selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, authUser } = useAuthStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative flex bg-white h-screen overflow-hidden">
      <div
        className={`fixed inset-y-0 z-40 bg-white w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-1/4 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          authUser={authUser}
          logout={logout}
        />
      </div>

      <div
        className={`flex flex-col w-full h-full ${
          isSidebarOpen ? "lg:w-3/4" : "lg:w-full"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        {!selectedUser ? <NoChatSelected /> : <SelectedChat />}
      </div>
    </div>
  );
};

export default Dashboard;
