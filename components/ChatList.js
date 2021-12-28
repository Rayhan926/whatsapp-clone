import getRecepientEmail from "./../utils/getRecepientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import LastMessageTime from "./LastMessageTime";
import UnseenMessageCount from "./UnseenMessageCount";
import LastSentMessage from "./LastSentMessage";

function ChatList({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  // Recipient Snapshot
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecepientEmail(users, user))
  );

  // Chat Snapshot
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const [messagesSnapshot, loading] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const audionRef = useRef(null);
  const [unseenMessageCount, setUnseenMessageCount] = useState(null);
  const [trackUnseenMessageCount, setTrackUnseenMessageCount] = useState("");

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recepientEmail = getRecepientEmail(users, user);

  // Tack User For When Make A Sound
  useEffect(() => {
    if (!loading) {
      if (unseenMessageCount && !trackUnseenMessageCount) {
        setTrackUnseenMessageCount(unseenMessageCount);
      }
      if (unseenMessageCount && trackUnseenMessageCount < unseenMessageCount) {
        audionRef.current.click();
        setTrackUnseenMessageCount(unseenMessageCount);
      }
    }
  }, [unseenMessageCount]);

  setTimeout(() => {
    setTrackUnseenMessageCount(unseenMessageCount);
  }, 5000);

  return (
    <>
      <audio
        src="/sound/chatList.mp3"
        ref={audionRef}
        id={`sound_${id}`}
        onClick={(e) => {
          document.getElementById(`sound_${id}`).currentTime = 0;
          document.getElementById(`sound_${id}`).play();
        }}
        style={{ display: "none" }}
      ></audio>
      <div
        className="chatList px-3 w-full flex items-center justify-between cursor-pointer hover:bg-gray-200"
        onClick={() => router.push(`/chat/${id}`)}
      >
        <div className="relative ffffffff">
          <div
            className={`absolute w-3 h-3 border-2 border-white rounded-full right-[8px] bottom-[2px] ${
              recipient?.online ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <div className="min-w-[42px] w-[42px] min-h-[42px] h-[42px] mr-3 rounded-full overflow-hidden">
            {recipient ? (
              <img
                className="w-full h-full flex justify-center items-center font-medium text-white text-2xl uppercase bg-[#455A64] object-cover"
                src={recipient?.photoURL}
                alt={recipient?.displayName[0] || recepientEmail[0]}
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center font-bold text-xl uppercase bg-[#455A64]">
                <p className="text-white font-semibold">{recepientEmail[0]}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-start flex-grow border-b border-gray-200 py-2.5">
          <div className="flex flex-col justify-start items-start flex-grow">
            <h4 className="text-gray-900 font-semibold mb-[-1px] text-base">
              {recipient?.displayName || recepientEmail}
            </h4>
            <div className="flex items-center">
              <>
                {chatsSnapshot &&
                  chatsSnapshot?.docs.map(
                    (chat, index) =>
                      chat?.data()?.typing.filter((c) => c === recepientEmail)
                        .length === 1 && (
                        <p
                          className="typing_p text-[#25D366] font-semibold text-sm typing_p_wrapper"
                          key={index}
                        >
                          Typing<span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </p>
                      )
                  )}

                <LastSentMessage snap={messagesSnapshot} />
              </>
            </div>
          </div>
          <div className="flex items-center justify-end text-right min-w-[50px]">
            <div className="text-[13px] flex flex-col items-end">
              <LastMessageTime snap={messagesSnapshot} />
              <UnseenMessageCount
                snap={messagesSnapshot}
                setIt={setUnseenMessageCount}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatList;
