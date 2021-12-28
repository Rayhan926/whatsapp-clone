import { useRef, useState } from "react";
import InputError from "./InputError";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import PuffLoader from "react-spinners/PuffLoader";

const regex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function AddChatPrompt({ onComplete }) {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const inputEmailRef = useRef(null);
  const [inputError, setInputError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleClose = (e) => {
    if (e.target.id === "promptWrapper") onComplete(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let emialVal = inputEmailRef.current.value;
    emialVal == "" && setInputError("required");
    emialVal && !regex.test(String(emialVal)) && setInputError("invalid");
    user.email === emialVal && setInputError("sameEmail");
    chatAlreadyExist(emialVal) && setInputError("exist");
    if (
      emialVal &&
      regex.test(String(emialVal)) &&
      user.email !== emialVal &&
      !chatAlreadyExist(emialVal)
    ) {
      setInputError("");
      setCreating(true);
      db.collection("chats")
        .add({
          users: [user.email, emialVal],
          typing: [],
        })
        .then(() => {
          setCreating(false);
          onComplete(false);
        })
        .catch((err) => {
          setCreating(false);
        });
    }
  };

  const chatAlreadyExist = (recepientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recepientEmail)?.length > 0
    );

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 z-50 flex justify-center items-center py-5 px-3 animate_fade"
      id="promptWrapper"
      onClick={handleClose}
    >
      <div className="bg-white rounded-md shadow-lg p-5 w-full relative overflow-hidden animate_slide_to_bottom">
        {creating && (
          <div className="absolute top-0 left-0 z-10 w-full h-full bg-white flex justify-center items-center">
            <PuffLoader color="#075E54" />
          </div>
        )}
        <h3 className="text-gray-800 text-center text-xl font-semibold">
          Add New Person To Start Chat
        </h3>
        <div className="mt-5">
          {inputError && <InputError errorType={inputError} />}
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              ref={inputEmailRef}
              placeholder="Person email you want to chat with"
              type="text"
              className="border w-full border-gray-300 focus:outline-none text-base text-gray-800 pt-[3px] pb-1.5 px-3 rounded transition duration-100 hover:border-gray-400 focus:border-gray-600 flex-grow"
            />
            <button className="border-none block w-full mt-4 outline-none py-2 pt-[6px] rounded px-5 bg-[#075E54] duration-150 hover:bg-[#094e46] text-white">
              Add Person
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddChatPrompt;
