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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        authUser={authUser}
        logout={logout}
      />

      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={toggleSidebar} />
        {!selectedUser ? <NoChatSelected /> : <SelectedChat />}
      </div>
    </div>
  );
};

export default Dashboard;
