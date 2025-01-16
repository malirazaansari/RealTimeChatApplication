import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./sekelton/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useauthstore";
const SelectedChat = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

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
                      message.sendId === authUser._id
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
