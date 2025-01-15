import { FiMenu, FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { GiRamProfile, GiThink } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaCaretDown } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { useAuthStore } from "../store/useauthstore";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { logout, authUser } = useAuthStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className={`
          lg:hidden fixed top-5 left-40 z-50 bg-[#008D9C] text-white p-1 rounded-lg 
          hover:bg-[#007483] transition-all duration-300
          ${isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {isSidebarOpen && (
        <div
          className="z-30 fixed inset-0 lg:hidden bg-black bg-opacity-50"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
          fixed lg:static w-[250px] bg-white border-r flex flex-col h-full z-40
          transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <button
          onClick={toggleSidebar}
          className="top-4 right-4 absolute lg:hidden hover:bg-gray-100 p-2 pr-2 pl-2 rounded-full text-gray-500 hover:text-gray-700"
        >
          <IoMdClose className="w-6 h-6" />
        </button>

        <div className="flex-1 p-4 overflow-y-auto">
          <h1 className="mt-4 mb-5 font-bold text-[#008D9C] text-center text-xl">
            Chat History
          </h1>

          <div className="flex justify-center mr-2 ml-2">
            <button className="bg-gradient-to-r from-[#008D9C] to-[#003136] hover:opacity-90 mt-2 px-3 py-2 rounded-lg w-full text-white transition-opacity">
              <div className="flex justify-center items-center gap-2">
                <GiThink className="w-5 h-5" />
                <span>New Chat</span>
              </div>
            </button>
          </div>

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

          <div className="mt-6">
            <hr className="border-[#008D9C] border-t-2" />
            <h2 className="mt-3 font-medium text-black text-center text-sm">
              Friends
            </h2>

            <div className="space-y-2 mt-3">
              <div className="hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <div className="text-[#008D9C] text-sm">Previous 7 Days</div>
                <div className="text-gray-400 text-sm">Hi, how are you...</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <div className="text-gray-500 text-sm">Previous 30 Days</div>
                <div className="text-gray-400 text-sm">
                  Lorem ipsum dolor sit adipiscing...
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pr-6 pl-6">
          {authUser && (
            <button
              onClick={logout}
              className="bg-gradient-to-r from-[#008D9C] to-[#003136] hover:opacity-90 px-3 py-2 rounded-lg w-full text-white transition-opacity"
            >
              <div className="flex justify-center items-center">
                <RiLogoutBoxRLine className="mr-2 w-5 h-5" />
                <span>Log out</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 2nd part */}
      <h2 className="font-semibold text-[#008D9C] text-1xl">Chat here</h2>
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-[#008D9C] px-4 py-1 rounded-lg text-white"
          >
            Add Friend
            <FaCaretDown className="w-5 h-5" />
          </button>

          {isDropdownOpen && (
            <div className="right-0 z-50 absolute border-gray-200 bg-white shadow-lg mt-2 border rounded-lg w-60">
              <div className="p-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
                  />
                  <div className="right-0 absolute inset-y-0 flex items-center pr-2">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {[1, 2, 3, 4].map((friend) => (
                  <div
                    key={friend}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 cursor-pointer"
                  >
                    <div className="flex justify-center items-center bg-[#008D9C] rounded-full w-8 h-8">
                      <BiUser className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700">Friend</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
