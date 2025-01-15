const SelectedChat = () => {
  return (
    <div className="flex flex-col flex-1 bg-[#F4F4F4]">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          <div className="flex items-start space-x-2">
            <div className="bg-[#008D9C] p-3 rounded-lg max-w-md">
              <p className="text-white">Hi, Are you Ok?</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-[#E8E8E8] p-3 rounded-lg max-w-md text-black">
              <p>Yep, Nothing wrong with me obviously I am ok.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="flex items-center space-x-2 border-[#008D9C] bg-[#F4F4F4] rounded-lg">
          <input
            type="text"
            placeholder="Start Chatting"
            className="flex-1 border-[#008D9C] border-2 bg-[#F4F4F4] p-3 rounded-lg focus:ring-2 focus:ring-[#008D9C] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectedChat;
