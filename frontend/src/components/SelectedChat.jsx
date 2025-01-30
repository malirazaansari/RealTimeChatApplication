import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./sekelton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import "../../src/index.css";

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
    if (!messageEndRef.current) return;

    setTimeout(() => {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100); // Delay of 100ms to ensure the DOM updates
  }, [messages, isTyping]);

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

    console.log("Unread messages:", unreadMessages);

    if (unreadMessages.length > 0) {
      unreadMessages.forEach((message) => {
        console.log("Marking message as read:", message._id);
        socket.emit("readMessage", {
          messageId: message._id,
          senderId: message.sendId,
        });
      });

      const updatedMessages = messages.map((message) =>
        unreadMessages.some((unread) => unread._id === message._id)
          ? { ...message, status: "read" }
          : message
      );

      console.log("Updated messages:", updatedMessages);

      useChatStore.setState({ messages: updatedMessages });
    }
  }, [selectedUser, messages, socket, authUser]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageSeen = ({ messageId }) => {
      const updatedMessages = messages.map((msg) =>
        msg._id === messageId ? { ...msg, status: "read" } : msg
      );

      useChatStore.setState({ messages: updatedMessages });
    };

    socket.on("messageSeen", handleMessageSeen);

    return () => {
      socket.off("messageSeen", handleMessageSeen);
    };
  }, [socket, messages]);

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
    <div className="flex flex-col bg-[#F4F4F4] w-full h-full">
      <div className="top-0 z-10 sticky bg-[#F4F4F4] p-4 border-b">
        <ChatHeader />
      </div>

      <div className="flex-1 mb-[72px] overflow-y-auto">
        {!messages.length && (
          <p className="text-center text-gray-500">
            No messages to display. Start the conversation!
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.sendId === authUser._id ? "chat-end" : "chat-start"
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
              <span className="opacity-50 ml-1 text-xs">
                {new Date(message.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                {new Date(message.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>

            <div className="flex flex-col chat-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="mb-2 rounded-md sm:max-w-[200px]"
                />
              )}
              <div className="break-all">
                {message.text && <p>{message.text}</p>}
              </div>

              {message.sendId === authUser._id && (
                <span className="mt-1 text-gray-500 text-xs">
                  {message.status === "read" ? "Seen" : "Delivered"}
                </span>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <p className="text-gray-500 text-sm">
            {selectedUser.name} is typing...
          </p>
        )}
        <div ref={messageEndRef}></div>
      </div>

      <div className="bottom-0 z-10 sticky bg-[#F4F4F4] p-4 border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default SelectedChat;
