// import { useEffect, useRef } from "react";
// import { useChatStore } from "../store/useChatStore";
// import ChatHeader from "./ChatHeader";
// import MessageInput from "./MessageInput";
// import MessageSkeleton from "./sekelton/MessageSkeleton";
// import { formatMessageTime } from "../lib/utils";
// import { useAuthStore } from "../store/useauthstore";
// const SelectedChat = () => {
//   const {
//     messages,
//     getMessages,
//     isMessagesLoading,
//     selectedUser,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//   } = useChatStore();

//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     getMessages(selectedUser._id).then((result) =>
//       console.log("Fetched Messages:", result)
//     );
//     const socket = useAuthStore.getState().socket;

//     if (socket && socket.connected) {
//       subscribeToMessages();
//     }

//     return () => {
//       unsubscribeFromMessages();
//     };
//   }, [
//     selectedUser._id,
//     getMessages,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//   ]);

//   useEffect(() => {
//     if (messageEndRef.current && messages)
//       messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (isMessagesLoading) {
//     return (
//       <div className="flex flex-col flex-1 overflow-auto">
//         <ChatHeader />
//         <MessageSkeleton />
//         <MessageInput />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col flex-1 bg-[#F4F4F4]">
//       <div className="flex-1 overflow-y-auto">
//         <ChatHeader />
//         <h1 className="mt-4 mb-5 font-bold text-[#008D9C] text-center text-xl">
//           Messages will appear here
//         </h1>
//         <div className="flex-1 space-y-4 p-4 overflow-y-auto">
//           {!messages.length && (
//             <p className="text-center text-gray-500">
//               No messages to display. Start the conversation!
//             </p>
//           )}
//           {messages.map((message) => (
//             <div
//               key={message._id}
//               ref={messageEndRef}
//               className={`chat ${
//                 message.senderId === authUser._id ? "chat-end" : "chat-start"
//               }`}
//             >
//               <div className="avatar chat-image">
//                 <div className="border rounded-full size-10">
//                   <img
//                     src={
//                       message.sendId === authUser._id
//                         ? authUser.profilePic || "/avatar.png"
//                         : selectedUser.profilePic || "/avatar.png"
//                     }
//                     alt="profile pic"
//                   />
//                 </div>
//               </div>
//               <div className="mb-1 chat-header">
//                 <time className="opacity-50 ml-1 text-xs">
//                   {formatMessageTime(message.createdAt)}
//                 </time>
//               </div>
//               <div className="flex flex-col chat-bubble">
//                 {message.image && (
//                   <img
//                     src={message.image}
//                     alt="Attachment"
//                     className="mb-2 rounded-md sm:max-w-[200px]"
//                   />
//                 )}
//                 {message.text && <p>{message.text}</p>}
//               </div>
//             </div>
//           ))}
//         </div>
//         <MessageInput />
//       </div>
//     </div>
//   );
// };

// export default SelectedChat;

import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useauthstore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./sekelton/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const SelectedChat = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch initial messages and subscribe/unsubscribe to messages on selected user change
  useEffect(() => {
    if (selectedUser) {
      // Fetch messages for the selected user
      getMessages(selectedUser._id).then((result) =>
        console.log("Fetched Messages:", result)
      );

      // Subscribe to messages when selected user is set
      subscribeToMessages();

      // Cleanup the subscription when the component is unmounted or selectedUser changes
      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#F4F4F4]">
      <div className="flex-1 overflow-y-auto">
        <ChatHeader />
        <h1 className="mt-4 mb-5 font-bold text-[#008D9C] text-center text-xl">
          Messages will appear here
        </h1>
        <div className="flex-1 space-y-4 p-4 overflow-y-auto">
          {!messages.length && (
            <p className="text-center text-gray-500">
              No messages to display. Start the conversation!
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message._id}
              ref={messageEndRef}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="avatar chat-image">
                <div className="border rounded-full size-10">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="mb-1 chat-header">
                <time className="opacity-50 ml-1 text-xs">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="flex flex-col chat-bubble">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="mb-2 rounded-md sm:max-w-[200px]"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
        </div>
        <MessageInput />
      </div>
    </div>
  );
};

export default SelectedChat;
