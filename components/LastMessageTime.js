import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
function LastMessageTime({ snap }) {
  const [user] = useAuthState(auth);
  const snapShots = snap?.docs;
  const lastSnap = snapShots && snapShots[snapShots?.length - 1]?.data();
  return (
    <p
      className={`font-medium ${
        lastSnap?.user !== user?.email && lastSnap?.seen === false
          ? "text-[#25D366]"
          : "text-gray-400"
      }`}
    >
      {moment(lastSnap?.timestamp?.toDate())?.format("LT")}
    </p>
  );
}

export default LastMessageTime;
