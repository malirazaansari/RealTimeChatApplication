import { GiRamProfile, GiThink } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, toggleSidebar, authUser, logout }) => {
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
    </div>
  );
};

export default Sidebar;
