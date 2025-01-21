// import { useRef, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { Image, Send, X } from "lucide-react";
// import toast from "react-hot-toast";

// const MessageInput = () => {
//   const [text, setText] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const fileInputRef = useRef(null);
//   const { sendMessage } = useChatStore();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     const trimmedText = text.trim();
//     if (!trimmedText && !imagePreview) {
//       console.error("Message must have text or an image.");
//       return;
//     }

//     try {
//       await sendMessage({
//         text: trimmedText || null,
//         image: imagePreview || null,
//       });

//       setText("");
//       setImagePreview(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     } catch (error) {
//       console.error("Failed to send message:", error);

//       alert("Failed to send message. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4 w-full">
//       {imagePreview && (
//         <div className="flex items-center gap-2 mb-3">
//           <div className="relative">
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="border-zinc-700 border rounded-lg w-20 h-20 object-cover"
//             />
//             <button
//               onClick={removeImage}
//               className="-top-1.5 -right-1.5 absolute flex justify-center items-center bg-base-300 rounded-full w-5 h-5"
//               type="button"
//             >
//               <X className="size-3" />
//             </button>
//           </div>
//         </div>
//       )}

//       <form
//         onSubmit={handleSendMessage}
//         className="flex items-center gap-2"
//       >
//         <div className="flex flex-1 gap-2">
//           <input
//             type="text"
//             className="flex-1 border-[#008D9C] border-2 bg-[#F4F4F4] p-3 rounded-lg focus:ring-2 focus:ring-[#008D9C] focus:outline-none"
//             placeholder="Type a message..."
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             ref={fileInputRef}
//             onChange={handleImageChange}
//           />

//           <button
//             type="button"
//             className={`hidden sm:flex btn btn-circle
//                      ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Image size={20} />
//           </button>
//         </div>
//         <button
//           type="submit"
//           className="btn btn-circle btn-sm"
//           disabled={!text.trim() && !imagePreview}
//         >
//           <Send size={22} />
//         </button>
//       </form>
//     </div>
//   );
// };
// export default MessageInput;

import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null); // Ref to handle typing debounce
  const { sendMessage, selectedUser } = useChatStore();
  const { authUser, socket } = useAuthStore(); // Access authUser and socket

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText && !imagePreview) {
      console.error("Message must have text or an image.");
      return;
    }

    try {
      await sendMessage({
        text: trimmedText || null,
        image: imagePreview || null,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      }); // Stop typing after sending
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleTyping = () => {
    if (!socket || !selectedUser) return;

    // Emit typing event
    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });

    // Clear previous timeout and set a new one to emit stopTyping
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }, 2000); // Stop typing after 2 seconds of inactivity
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="border-zinc-700 border rounded-lg w-20 h-20 object-cover"
            />
            <button
              onClick={removeImage}
              className="-top-1.5 -right-1.5 absolute flex justify-center items-center bg-base-300 rounded-full w-5 h-5"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2"
      >
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="flex-1 border-[#008D9C] border-2 bg-[#F4F4F4] p-3 rounded-lg focus:ring-2 focus:ring-[#008D9C] focus:outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping(); // Call handleTyping on text change
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle btn-sm"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
