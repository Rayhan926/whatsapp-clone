import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecepientEmail from "./../../utils/getRecepientEmail";
import ChatScreenHeader from "./../../components/ChatScreenHeader";
import { useCollection } from "react-firebase-hooks/firestore";
import { BiSmile } from "react-icons/bi";
import { MdSend } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import Message from "./../../components/Message";
import Head from "next/head";
import linkifyHtml from "linkifyjs/html";

function Chat({ chat, messages }) {
  const router = useRouter();
  const audionRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [soundToPlay, setSoundToPlay] = useState(false);
  const [prevMessagesCount, setPrevMessagesCount] = useState(null);
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecepientEmail(chat.users, user))
  );
  const recepientEmail = getRecepientEmail(chat.users, user);

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  useEffect(() => {
    if (
      messagesSnapshot &&
      soundToPlay &&
      messagesSnapshot?.docs[messagesSnapshot?.docs?.length - 1].data().user ===
        recepientEmail
    ) {
      audionRef.current.click();
    }
  }, [messagesSnapshot?.docs?.length]);

  useEffect(() => {
    chatsSnapshot?.docs.map((chat) => {
      let prevTypers = chat.data().typing;
      if (inputValue.length > 0 && inputValue.length <= 5) {
        prevTypers.push(user.email);
        let uniqueTyper = [...new Set(prevTypers)];
        db.collection("chats").doc(router.query.chatId).set(
          {
            typing: uniqueTyper,
          },
          {
            merge: true,
          }
        );
      }
      if (!inputValue) {
        let removeTyper = prevTypers?.filter(
          (prevTyper) => prevTyper !== user.email
        );
        db.collection("chats").doc(router.query.chatId).set(
          {
            typing: removeTyper,
          },
          {
            merge: true,
          }
        );
      }
    });
  }, [inputValue]);

  useEffect(() => {
    setSoundToPlay(true);
  }, []);

  const scrollToBottom = (cstmTime) => {
    setTimeout(() => {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, cstmTime || 50);
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      db.collection("chats")
        .doc(router.query.chatId)
        .collection("messages")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              recepientEmail ===
              doc._delegate._document.data.value.mapValue.fields.user
                .stringValue
            ) {
              doc.ref.update({
                seen: true,
              });
            }
          });
        });

      if (prevMessagesCount === null) {
        scrollToBottom();
        setPrevMessagesCount(messagesSnapshot.docs.length);
      }

      if (
        prevMessagesCount &&
        prevMessagesCount < messagesSnapshot.docs.length
      ) {
        setPrevMessagesCount(messagesSnapshot.docs.length);
        scrollToBottom();
      }

      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) return null;
    // Update Last Seen
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(router.query.chatId)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: linkifyHtml(inputValue, {
          defaultProtocol: "http",
          target: "_blank",
        }),
        user: user.email,
        photoURL: user.photoURL,
        seen: false,
      });
    setInputValue("");
    scrollToBottom();
    document.getElementById("chatInput").focus();
  };

  return (
    <>
      <Head>
        <title>
          {recipientSnapshot?.docs?.[0]?.data()?.displayName || recepientEmail}
        </title>
      </Head>
      <Layout className="flex flex-col">
        <audio
          src="/sound/chatScreen.mp3"
          ref={audionRef}
          id="chatScreen_audio"
          onClick={(e) => {
            document.getElementById("chatScreen_audio").currentTime = 0;
            document.getElementById("chatScreen_audio").play();
          }}
          style={{ display: "none" }}
        ></audio>
        <ChatScreenHeader
          recipientSnapshot={recipientSnapshot}
          recepientEmail={recepientEmail}
        />
        <div
          className="flex-grow overflow-auto flex flex-col"
          style={{
            backgroundImage: 'url("/img/wallpaper.jpg")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex-grow px-3 overflow-auto thin_scrollbar">
            {showMessages()}
            <div ref={endOfMessagesRef}></div>
          </div>

          {/* Input  */}
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="p-1 flex items-end">
              <div
                className="flex-grow h-11 px-2 bg-white rounded-full flex items-center"
                style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.12)" }}
              >
                <div className="h-full flex justify-center items-center">
                  <BiSmile className="w-6 h-6 text-gray-500 cursor-pointer" />
                </div>
                <div className="flex-grow h-full flex justify-center items-center">
                  <input
                    id="chatInput"
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    type="text"
                    autoComplete="off"
                    className="w-full border-none outline-none h-full rounded-full text-gray-900 text-lg px-2"
                    placeholder="Type a message"
                  />
                </div>
              </div>
              <button className="w-11 h-11 border-none outline-none ml-1 p-2.5 cursor-pointer rounded-full overflow-hidden bg-[#128C7E] flex items-center justify-center duration-150 hover:bg-[#094e46]">
                <MdSend className="text-white w-full h-full" />
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.chatId);

  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
