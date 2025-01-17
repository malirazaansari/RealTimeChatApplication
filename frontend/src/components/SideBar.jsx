import { GiRamProfile, GiThink } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./sekelton/SideBarSekelton";
import { useAuthStore } from "../store/useauthstore";

const Sidebar = ({ isSidebarOpen, toggleSidebar, authUser, logout }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <div
      className={`
        fixed lg:static w-[250px] bg-white border-r flex flex-col h-full z-40
        transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
    >
      <button
        onClick={toggleSidebar}
        className="top-4 right-4 absolute lg:hidden hover:bg-gray-100 p-2 pr-2 pl-2 rounded-full text-gray-500 hover:text-gray-700"
      >
        <IoMdClose className="w-6 h-6" />
      </button>

      <div className="flex-1 p-4 border-b-2 border-blue-500">
        <h1 className="mt-4 mb-5 font-bold text-[#008D9C] text-center text-xl">
          {authUser ? `${authUser.name}` : "Loading..."}
        </h1>
        {/* <div className="flex justify-center mr-2 ml-2">
          <button className="bg-gradient-to-r from-[#008D9C] to-[#003136] hover:opacity-90 mt-2 px-3 py-2 rounded-lg w-full text-white transition-opacity">
            <div className="flex justify-center items-center gap-2">
              <GiThink className="w-5 h-5" />
              <span>New Chat</span>
            </div>
          </button>
        </div> */}
        <div className="flex justify-center mr-2 ml-2">
          <Link
            to="/profileupdate"
            className="bg-gradient-to-r from-[#008D9C] to-[#003136] hover:opacity-90 mt-2 px-3 py-2 rounded-lg w-full text-white transition-opacity"
          >
            <div className="flex justify-center items-center gap-2">
              <GiRamProfile className="w-5 h-5" />
              <span>Profile</span>
            </div>
          </Link>
        </div>
        <div className="flex justify-center mr-2 ml-2">
          <Link
            to="/settings"
            className="bg-gradient-to-r from-[#008D9C] to-[#003136] hover:opacity-90 mt-2 px-3 py-2 rounded-lg w-full text-white transition-opacity"
          >
            <div className="flex justify-center items-center gap-2">
              <IoSettingsOutline className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="py-3 w-full h-2/3">
        <div className="lg:flex items-center gap-2 hidden mt-3 ml-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-gray-500 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-gray-400 ring-1 ring-gray-200 rounded-lg"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="rounded-full object-cover size-12"
              />
              {onlineUsers.includes(user._id) && (
                <span className="right-0 bottom-0 absolute bg-green-500 rounded-full ring-2 ring-zinc-900 size-3" />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="lg:block hidden min-w-0 text-left">
              <div className="font-medium text-gray-950 truncate">
                {user.name}
              </div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="py-4 text-center text-zinc-500">No online users</div>
        )}
      </div>

      {authUser && (
        <div className="p-4 pr-6 pl-6">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-[#008D9C] to-[#003136] hover:opacity-90 px-3 py-2 rounded-lg w-full text-white transition-opacity"
          >
            <div className="flex justify-center items-center">
              <RiLogoutBoxRLine className="mr-2 w-5 h-5" />
              <span>Log out</span>
            </div>
          </button>
        </div>
      )}
      {filteredUsers.length === 0 && (
        <div className="py-4 text-center text-zinc-500">No online users</div>
      )}
    </div>
  );
};

export default Sidebar;
