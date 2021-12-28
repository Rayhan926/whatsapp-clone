import { FiArrowLeft } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import IconCompo from "./IconCompo";
import { useRouter } from "next/router";
import TimeAgo from "timeago-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TypingAnimation from "./TypingAnimation";

function ChatScreenHeader({ recipientSnapshot, recepientEmail, className }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  return (
    <>
      <div
        className={`flex items-center justify-between bg-[#075E54] py-2 px-3 ${
          className || ""
        }`}
      >
        <div className="flex items-end">
          <div
            className="text-white flex items-center rounded-full px-[3px] py-[2px] hover:bg-[#ffffff1a] duration-200 cursor-pointer"
            onClick={() => router.back()}
          >
            <FiArrowLeft className="w-5 h-5" />
            <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ml-1">
              {recipient ? (
                <img
                  src={recipient?.photoURL}
                  className="w-full h-full flex justify-center items-center font-medium text-gray-600 text-base uppercase bg-white object-cover"
                  alt={recipient?.displayName[0] || recipient?.email[0]}
                  id="dropdown_click"
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center font-bold text-gray-600 text-base uppercase bg-white">
                  <p className="font-medium">
                    {recipient?.displayName[0] || recepientEmail[0]}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="pl-2">
            <h3 className="text-white text-sm font-semibold tracking-wide mb-[-2px]">
              {recipient?.displayName || recepientEmail}
            </h3>
            {chatsSnapshot &&
              chatsSnapshot?.docs.map(
                (chat) =>
                  chat?.data()?.typing.filter((c) => c === recepientEmail)
                    .length === 1 && <TypingAnimation />
              )}
            <p className="text-gray-300 text-xs font-medium lastSeen_p">
              {recipient?.online ? (
                "online"
              ) : recipientSnapshot ? (
                <>
                  {recipient?.lastSeen?.toDate() ? (
                    <>
                      Last seen at{" "}
                      <TimeAgo datetime={recipient.lastSeen?.toDate()} />
                    </>
                  ) : (
                    "Unavaliable"
                  )}
                </>
              ) : (
                "Loading last active.."
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            <IconCompo Icon={BiDotsVerticalRounded} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatScreenHeader;
