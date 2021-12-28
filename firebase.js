import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD_yS43kewRWGFCw0yHpw_OZUG_BJl3kuE",
  authDomain: "saymon-whatsapp-clone.firebaseapp.com",
  projectId: "saymon-whatsapp-clone",
  storageBucket: "saymon-whatsapp-clone.appspot.com",
  messagingSenderId: "5140472463",
  appId: "1:5140472463:web:9787073724c1f8f60406fa"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
