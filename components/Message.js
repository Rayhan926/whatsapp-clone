import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import parse from "html-react-parser";

function Message({ user, message }) {
  const [userLoogedIn] = useAuthState(auth);
  const sender = user === userLoogedIn.email ? true : false;

  return (
    <>
      <div
        className={`flex animate_slide_to_bottom ${
          sender
            ? "justify-end sender_message"
            : "justify-start receiver_message"
        } first:mt-1 mb-1`}
      >
        <p
          className={`chatEachLine max-w-[80%] py-[3px] pb-[4.5px] px-2 rounded leading-[23px] relative tringle_shape ${
            sender ? "bg-[#DCF8C6]" : "bg-white"
          }`}
          style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.2)" }}
        >
          {parse(message.message)}
          <span className="float-right ml-2 text-xs text-gray-500 mt-[7px] flex items-center">
            {message.timestamp ? (
              moment(message.timestamp).format("LT")
            ) : (
              <span className="typing_p_wrapper">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            )}
            {sender && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 15"
                width="16"
                height="15"
                className={`ml-1 ${
                  message.seen ? "text-[#34B7F1]" : "text-gray-400"
                }`}
              >
                <path
                  fill="currentColor"
                  d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                ></path>
              </svg>
            )}
          </span>
        </p>
      </div>
    </>
  );
}

export default Message;
