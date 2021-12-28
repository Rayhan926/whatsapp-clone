import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function useTyping(recepientEmail) {
  const [typing, setTyping] = useState(false);
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  useEffect(() => {
    chatsSnapshot &&
      chatsSnapshot?.docs.map((chat) => {
        setTyping(
          chat?.data()?.typing.filter((c) => c === recepientEmail).length === 1
        );
      });
  });
  return { typing };
}

export default useTyping;
