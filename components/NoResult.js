import { RiChatOffLine } from "react-icons/ri";
function NoResult() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <RiChatOffLine className="w-16 h-16 text-gray-300 mb-3" />
      <h3 className="text-gray-400 text-xl mb-4 font-medium">
        No result found
      </h3>
    </div>
  );
}

export default NoResult;
