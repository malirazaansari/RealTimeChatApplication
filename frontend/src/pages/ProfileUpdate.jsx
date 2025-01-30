import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { BiCamera, BiUser } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";

const ProfileUpdate = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
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
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-8 bg-base-300 mx-auto p-6 rounded-xl max-w-2xl">
            <div className="text-center">
              <h1 className="font-semibold text-2xl">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="border-4 rounded-full object-cover size-32"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <BiCamera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <BiUser className="w-4 h-4" />
                  Name
                </div>
                <p className="bg-base-200 px-4 py-2.5 border rounded-lg">
                  {authUser?.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <CiMail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="bg-base-200 px-4 py-2.5 border rounded-lg">
                  {authUser?.email}
                </p>
              </div>
            </div>

            <div className="bg-base-300 mt-6 p-6 rounded-xl">
              <h2 className="mb-4 font-medium text-lg">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-zinc-700 py-2 border-b">
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default ProfileUpdate;

// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { BiCamera, BiUser } from "react-icons/bi";
// import { CiMail } from "react-icons/ci";
// import Navbar from "../components/NavBar";
// import Sidebar from "../components/SideBar";
// const ProfileUpdate = () => {
//   const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
//   const [selectedImg, setSelectedImg] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       const base64Image = reader.result;
//       setSelectedImg(base64Image);
//       await updateProfile({ profilePic: base64Image });
//     };
//   };

//   return (
//     <>
//       <div className="flex h-screen">
//         <Sidebar
//           isSidebarOpen={isSidebarOpen}
//           toggleSidebar={toggleSidebar}
//           authUser={authUser}
//           logout={logout}
//         />
//         <div className="flex-1">
//           <Navbar toggleSidebar={toggleSidebar} />
//           <div className="pt-20 h-screen">
//             <div className="mx-auto py-8 p-4 max-w-2xl">
//               <div className="space-y-8 bg-base-300 p-6 rounded-xl">
//                 <div className="text-center">
//                   <h1 className="font-semibold text-2xl">Profile</h1>
//                   <p className="mt-2">Your profile information</p>
//                 </div>

//                 <div className="flex flex-col items-center gap-4">
//                   <div className="relative">
//                     <img
//                       src={selectedImg || authUser.profilePic || "/avatar.png"}
//                       alt="Profile"
//                       className="border-4 rounded-full object-cover size-32"
//                     />
//                     <label
//                       htmlFor="avatar-upload"
//                       className={`
//                   absolute bottom-0 right-0
//                   bg-base-content hover:scale-105
//                   p-2 rounded-full cursor-pointer
//                   transition-all duration-200
//                   ${
//                     isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
//                   }
//                 `}
//                     >
//                       <BiCamera className="w-5 h-5 text-base-200" />
//                       <input
//                         type="file"
//                         id="avatar-upload"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         disabled={isUpdatingProfile}
//                       />
//                     </label>
//                   </div>
//                   <p className="text-sm">
//                     {isUpdatingProfile
//                       ? "Uploading..."
//                       : "Click the camera icon to update your photo"}
//                   </p>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-2 text-sm">
//                       <BiUser className="w-4 h-4" />
//                       Name
//                     </div>
//                     <p className="bg-base-200 px-4 py-2.5 border rounded-lg">
//                       {authUser?.name}
//                     </p>
//                   </div>

//                   <div className="space-y-1.5">
//                     <div className="flex items-center gap-2 text-sm">
//                       <CiMail className="w-4 h-4" />
//                       Email Address
//                     </div>
//                     <p className="bg-base-200 px-4 py-2.5 border rounded-lg">
//                       {authUser?.email}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-base-300 mt-6 p-6 rounded-xl">
//                   <h2 className="mb-4 font-medium text-lg">
//                     Account Information
//                   </h2>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between items-center border-zinc-700 py-2 border-b">
//                       <span>Member Since</span>
//                       <span>{authUser.createdAt?.split("T")[0]}</span>
//                     </div>
//                     <div className="flex justify-between items-center py-2">
//                       <span>Account Status</span>
//                       <span className="text-green-500">Active</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default ProfileUpdate;
