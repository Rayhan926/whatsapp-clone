import parse from "html-react-parser";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
function LastSentMessage({ snap }) {
  const [user] = useAuthState(auth);
  const snapShots = snap?.docs;
  const lastSnap = snapShots && snapShots[snapShots?.length - 1];
  return (
    <div className="lastSeen_p flex items-center">
      {user.email === lastSnap?.data()?.user && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 13"
          width="14"
          height="13"
          className={`mr-1 ${
            lastSnap?.data()?.seen ? "text-[#34B7F1]" : "text-gray-400"
          }`}
        >
          <path
            fill="currentColor"
            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
          ></path>
        </svg>
      )}
      <p className="text-gray-600 text-sm line_clamp_1 is_link_then_pointer_none">
        {parse(lastSnap?.data()?.message || "Say Hello")}
      </p>
    </div>
  );
}

export default LastSentMessage;
