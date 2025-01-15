const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          <div className="avatar chat-image">
            <div className="rounded-full size-10">
              <div className="rounded-full w-full h-full skeleton" />
            </div>
          </div>

          <div className="mb-1 chat-header">
            <div className="w-16 h-4 skeleton" />
          </div>

          <div className="bg-transparent p-0 chat-bubble">
            <div className="w-[200px] h-16 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
