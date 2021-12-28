import { useState } from "react";
import { BsChatDots } from "react-icons/bs";
import AddChatPrompt from "./AddChatPrompt";

function NoChatToShow() {
  const [promptComplete, setPromptComplete] = useState(false);
  return (
    <>
      {promptComplete && <AddChatPrompt onComplete={setPromptComplete} />}
      <div className="w-full h-full flex justify-center items-center flex-col">
        <BsChatDots className="w-16 h-16 text-gray-300 mb-3" />
        <h3 className="text-gray-900 text-xl mb-4 font-semibold">
          No previous chat to show
        </h3>
        <button
          className="border-none outline-none py-2 pt-[6px] rounded-sm px-5 bg-[#075E54] duration-150 hover:bg-[#094e46] text-white"
          onClick={() => setPromptComplete(true)}
        >
          Add New Chat
        </button>
      </div>
    </>
  );
}

export default NoChatToShow;
