import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import "tailwindcss/tailwind.css";
import "../styles/style.css";
import Login from "./../components/Login";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import firebase from "firebase";
import Router from "next/router";

function MyApp({ Component, pageProps }) {
  const [loadingRouter, setLoadingRouter] = useState(false);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const start = () => setLoadingRouter(true);
    const end = () => setLoadingRouter(false);
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  const updateUserOrCreate = (userData) => {
    db.collection("users").doc(user.uid).set(userData, { merge: true });
  };

  useEffect(() => {
    if (user) {
      updateUserOrCreate({
        displayName: user.displayName,
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
        online: true,
      });

      window.addEventListener("blur", () => {
        if (user) {
          updateUserOrCreate({
            online: false,
          });
        }
      });
      window.addEventListener("focus", () => {
        if (user) {
          updateUserOrCreate({
            online: true,
          });
        }
      });
    }

    return () => {
      window.removeEventListener("focus", {}, false);
      window.removeEventListener("blur", {}, false);
    };
  }, [user]);
  if (loadingRouter) return <Loading icons />;
  if (loading) return <Loading />;
  if (!user) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
