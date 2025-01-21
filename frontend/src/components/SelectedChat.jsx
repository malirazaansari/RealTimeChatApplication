import { useEffect, useRef } from "react";
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

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

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
    <div className="flex flex-col bg-[#F4F4F4] h-full">
      <div className="top-0 z-10 sticky bg-[#F4F4F4] p-4 border-b">
        <ChatHeader />
      </div>

      <div className="flex-1 space-y-4 p-4 pb-[72px] overflow-y-auto">
        {!messages.length && (
          <p className="text-center text-gray-500">
            No messages to display. Start the conversation!
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message._id}
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
              <formatMessageTime className="opacity-50 ml-1 text-xs">
                {new Date(message.createdAt).toLocaleTimeString()}
              </formatMessageTime>
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

      <div className="bottom-0 z-10 sticky bg-[#F4F4F4] p-4 border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default SelectedChat;
