import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { FiSearch, FiMenu } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-between items-center border-[#008D9C] mx-5 mt-3 p-2 border-t border-b">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="lg:hidden bg-[#008D9C] hover:bg-[#007483] p-2 rounded-lg text-white transition-all"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <h2
          className="font-semibold text-[#008D9C] text-1xl cursor-pointer"
          onClick={handleTitleClick}
        >
          Chat Application
        </h2>
      </div>

      <div className="flex items-center">
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-[#008D9C] px-4 py-1 rounded-lg text-white"
          >
            Friends
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
                      <FaCaretRight className="w-5 h-5 text-white" />
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
};

export default NavBar;
