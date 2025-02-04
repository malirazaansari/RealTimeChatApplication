import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaCaretDown } from "react-icons/fa";
import { FiSearch, FiMenu } from "react-icons/fi";

const NavBar = ({ toggleSidebar }) => {
  const { authUser } = useAuthStore();
  const { users, getUsers, setSelectedUser } = useChatStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friendStatuses, setFriendStatuses] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (authUser) fetchFriendStatuses();
  }, [users, authUser]);

  const fetchFriendStatuses = async () => {
    try {
      const response = await axios.get(`/api/friends/${authUser._id}`);
      const statusMap = {};
      const pending = [];

      response.data.friends.forEach((friend) => {
        const friendId =
          friend.sender._id === authUser._id
            ? friend.receiver._id
            : friend.sender._id;

        if (friend.status === "pending") {
          statusMap[friendId] =
            friend.sender._id === authUser._id ? "Pending" : "Accept";
          if (friend.sender._id !== authUser._id) {
            pending.push({
              requestId: friend._id,
              sender: friend.sender,
            });
          }
        } else if (friend.status === "accepted") {
          statusMap[friendId] = "Accepted";
        }
      });

      setFriendStatuses(statusMap);
      setPendingRequests(pending);
    } catch (error) {
      console.error("Error fetching friend statuses", error);
    }
  };

  const sendFriendRequest = async (userId) => {
    if (!authUser || !authUser._id) {
      toast.error("You must be logged in to send friend requests.");
      return;
    }

    if (
      friendStatuses[userId] === "Pending" ||
      friendStatuses[userId] === "Accepted"
    ) {
      toast.error("Friend request already sent or accepted.");
      return;
    }

    try {
      await axios.post("/api/friends/send-request", {
        senderId: authUser._id,
        receiverId: userId,
      });

      setFriendStatuses((prev) => ({ ...prev, [userId]: "Pending" }));
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request", error);
      toast.error(
        error.response?.data?.message || "Failed to send friend request"
      );
    }
  };

  const acceptFriendRequest = async (userId) => {
    try {
      const request = pendingRequests.find((req) => req.sender._id === userId);
      if (!request) {
        toast.error("Friend request not found!");
        return;
      }

      await axios.post("/api/friends/accept-request", {
        requestId: request.requestId,
      });

      setFriendStatuses((prev) => ({ ...prev, [userId]: "Accepted" }));
      setPendingRequests((prev) =>
        prev.filter((req) => req.sender._id !== userId)
      );
      toast.success("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request", error);
      toast.error(
        error.response?.data?.message || "Failed to accept friend request"
      );
    }
  };

  const declineFriendRequest = async (userId) => {
    try {
      const request = pendingRequests.find((req) => req.sender._id === userId);
      if (!request) {
        toast.error("Friend request not found!");
        return;
      }

      await axios.delete(`/api/friends/decline-request/${request.requestId}`);

      setFriendStatuses((prev) => {
        const updatedStatuses = { ...prev };
        delete updatedStatuses[userId];
        return updatedStatuses;
      });

      setPendingRequests((prev) =>
        prev.filter((req) => req.sender._id !== userId)
      );

      toast.success("Friend request declined.");
    } catch (error) {
      console.error("Error declining friend request", error);
      toast.error("Failed to decline friend request.");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    navigate(`/`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex justify-between items-center border-[#008D9C] mt-3 p-2 border-t border-b w-full">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="lg:hidden bg-[#008D9C] hover:bg-[#007483] p-2 rounded-lg text-white transition-all"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <h2
          className="font-semibold text-[#008D9C] text-1xl cursor-pointer"
          onClick={() => navigate("/")}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="right-0 absolute inset-y-0 flex items-center pr-2">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 cursor-pointer"
                  >
                    <span className="flex-grow text-gray-700">{user.name}</span>

                    {friendStatuses[user._id] === "Accepted" ? (
                      <span className="font-semibold text-green-500">
                        Accepted
                      </span>
                    ) : friendStatuses[user._id] === "Pending" ? (
                      <span className="font-semibold text-yellow-500">
                        Pending
                      </span>
                    ) : friendStatuses[user._id] === "Accept" ? (
                      <>
                        <button
                          onClick={() => acceptFriendRequest(user._id)}
                          className="text-blue-500"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineFriendRequest(user._id)}
                          className="text-red-500"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => sendFriendRequest(user._id)}
                        className="text-[#008D9C]"
                      >
                        Add Friend
                      </button>
                    )}
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

// import { FaCaretDown } from "react-icons/fa";
// import { FiSearch, FiMenu } from "react-icons/fi";
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useChatStore } from "../store/useChatStore";

// const NavBar = ({ toggleSidebar }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const { users, getUsers, setSelectedUser } = useChatStore();

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);

//   useEffect(() => {
//     setFilteredUsers(
//       users.filter((user) =>
//         user.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     );
//   }, [searchQuery, users]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleUserClick = (user) => {
//     setSelectedUser(user);
//     navigate(`/`);
//     setIsDropdownOpen(false);
//   };

//   return (
//     <div className="relative flex justify-between items-center border-[#008D9C] mt-3 p-2 border-t border-b w-full">
//       <div className="flex items-center gap-2">
//         <button
//           onClick={toggleSidebar}
//           className="lg:hidden bg-[#008D9C] hover:bg-[#007483] p-2 rounded-lg text-white transition-all"
//         >
//           <FiMenu className="w-6 h-6" />
//         </button>
//         <h2
//           className="font-semibold text-[#008D9C] text-1xl cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           Chat Application
//         </h2>
//       </div>

//       <div className="flex items-center">
//         <div
//           className="relative"
//           ref={dropdownRef}
//         >
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="flex items-center gap-2 bg-[#008D9C] px-4 py-1 rounded-lg text-white"
//           >
//             Friends
//             <FaCaretDown className="w-5 h-5" />
//           </button>
//           {isDropdownOpen && (
//             <div className="right-0 z-50 absolute border-gray-200 bg-white shadow-lg mt-2 border rounded-lg w-60">
//               <div className="p-2">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-[#008D9C] w-full focus:outline-none"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   <div className="right-0 absolute inset-y-0 flex items-center pr-2">
//                     <FiSearch className="w-5 h-5 text-gray-400" />
//                   </div>
//                 </div>
//               </div>
//               <div className="max-h-60 overflow-y-auto">
//                 {filteredUsers.map((user) => (
//                   <div
//                     key={user._id}
//                     onClick={() => handleUserClick(user)}
//                     className="flex items-center gap-3 hover:bg-gray-50 p-2 cursor-pointer"
//                   >
//                     <div className="flex justify-center items-center bg-[#008D9C] rounded-full w-8 h-8">
//                       <img
//                         src={user.profilePic || "/avatar.png"}
//                         alt={user.name}
//                         className="rounded-full w-full h-full object-cover"
//                       />
//                     </div>
//                     <span className="text-gray-700">{user.name}</span>
//                   </div>
//                 ))}
//                 {!filteredUsers.length && (
//                   <p className="text-center text-gray-500">No friends found</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NavBar;
