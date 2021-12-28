import Head from "next/head";
import ChatList from "../components/ChatList";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/Loading";
import NoChatToShow from "../components/NoChatToShow";
import { useState } from "react";
import NoResult from "./../components/NoResult";

export default function Home() {
  const [user] = useAuthState(auth);
  const [noResult, setNoResult] = useState(false);

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot, loading] = useCollection(userChatRef);

  chatsSnapshot?.docs.map((chat) => {
    let prevTypers = chat.data().typing;
    let removeTyper = prevTypers?.filter(
      (prevTyper) => prevTyper !== user.email
    );
    db.collection("chats").doc(chat.id).set(
      {
        typing: removeTyper,
      },
      {
        merge: true,
      }
    );
  });

  return (
    <>
      {loading ? (
        <Loading icons />
      ) : (
        <>
          <Head>
            <title>Whatsapp Clone | By Saymon</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Layout className="flex flex-col">
            <Header icons setNoResult={setNoResult} />
            <div className="flex-grow overflow-auto thin_scrollbar">
              {chatsSnapshot?.docs.length > 0 ? (
                chatsSnapshot?.docs.map((chat) => (
                  <ChatList
                    key={chat.id}
                    id={chat.id}
                    users={chat.data().users}
                  />
                ))
              ) : (
                <NoChatToShow />
              )}
              {noResult && <NoResult />}
            </div>
          </Layout>
        </>
      )}
    </>
  );
}
