import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./sekelton/MessageSkeleton";
// import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

const SelectedChat = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id).then((result) =>
        console.log("Fetched Messages:", result)
      );

      subscribeToMessages();

      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(true);
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (!selectedUser || !messages.length) return;

    const unreadMessages = messages.filter(
      (message) =>
        message.receiverId === authUser._id && message.status !== "read"
    );

    unreadMessages.forEach((message) => {
      socket.emit("readMessage", {
        messageId: message._id,
        senderId: message.senderId,
      });
    });
  }, [selectedUser, messages, socket, authUser]);

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
    // <div className="flex flex-col bg-[#F4F4F4] h-full">
    //   <div className="top-0 z-10 sticky bg-[#F4F4F4] p-4 border-b">
    //     <ChatHeader />
    //   </div>

    //   <div className="flex-1 space-y-4 p-4 pb-[72px] overflow-y-auto">
    //     {!messages.length && (
    //       <p className="text-center text-gray-500">
    //         No messages to display. Start the conversation!
    //       </p>
    //     )}
    //     {messages.map((message) => (
    //       <div
    //         key={message._id}
    //         className={`chat ${
    //           message.senderId === authUser._id ? "chat-end" : "chat-start"
    //         }`}
    //       >
    //         <div className="avatar chat-image">
    //           <div className="border rounded-full size-10">
    //             <img
    //               src={
    //                 message.senderId === authUser._id
    //                   ? authUser.profilePic || "/avatar.png"
    //                   : selectedUser.profilePic || "/avatar.png"
    //               }
    //               alt="profile pic"
    //             />
    //           </div>
    //         </div>
    //         <div className="mb-1 chat-header">
    //           <formatMessageTime className="opacity-50 ml-1 text-xs">
    //             {new Date(message.createdAt).toLocaleTimeString()}
    //           </formatMessageTime>
    //         </div>
    //         <div className="flex flex-col chat-bubble">
    //           {message.image && (
    //             <img
    //               src={message.image}
    //               alt="Attachment"
    //               className="mb-2 rounded-md sm:max-w-[200px]"
    //             />
    //           )}
    //           {message.text && <p>{message.text}</p>}
    //         </div>
    //       </div>
    //     ))}
    //     <div>
    //       {/* Existing Chat UI */}
    //       {isTyping && <p>{selectedUser.name} is typing...</p>}
    //     </div>
    //     <div ref={messageEndRef}></div>
    //   </div>

    //   <div className="bottom-0 z-10 sticky bg-[#F4F4F4] p-4 border-t">
    //     <MessageInput />
    //   </div>
    // </div>
    <div className="flex flex-col bg-[#F4F4F4] w-full h-full">
      {/* Chat Header */}
      <div className="top-0 z-10 sticky bg-[#F4F4F4] p-4 border-b">
        <ChatHeader />
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 p-4 pb-[72px] overflow-y-auto">
        {!messages.length && (
          <p className="text-center text-gray-500">
            No messages to display. Start the conversation!
          </p>
        )}

        {/* Render messages */}
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            {/* Avatar */}
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

            {/* Message Header */}
            <div className="mb-1 chat-header">
              <span className="opacity-50 ml-1 text-xs">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>

            {/* Message Content */}
            <div className="flex flex-col chat-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="mb-2 rounded-md sm:max-w-[200px]"
                />
              )}
              {message.text && <p>{message.text}</p>}

              {/* Read/Unread Status */}
              {message.senderId === authUser._id && (
                <span className="mt-1 text-gray-500 text-xs">
                  {message.status === "read" ? "Seen" : "Delivered"}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <p className="text-gray-500 text-sm">
            {selectedUser.name} is typing...
          </p>
        )}

        {/* Scroll to the bottom */}
        <div ref={messageEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="bottom-0 z-10 sticky bg-[#F4F4F4] p-4 border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default SelectedChat;
