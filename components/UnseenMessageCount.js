import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function UnseenMessageCount({ snap, setIt }) {
  useEffect(() => {
    setIt(showUnseen());
  });
  const [user] = useAuthState(auth);
  const snapShots = snap?.docs;
  const lastSnap = snapShots && snapShots[snapShots?.length - 1];
  const showUnseen = () => {
    let totalUnseen = snapShots
      ?.map((msg) => msg?.data())
      ?.filter((e) => e?.seen === false)?.length;
    return totalUnseen;
  };
  return (
    <>
      {showUnseen() > 0 && lastSnap?.data()?.user !== user.email && (
        <div className="bg-[#25D366] rounded-full min-w-[21px] h-[21px] overflow-hidden text-white flex justify-center items-center">
          <span className="font-bold text-[11px]">{showUnseen()}</span>
        </div>
      )}
    </>
  );
}

export default UnseenMessageCount;
