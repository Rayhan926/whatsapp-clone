import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import { GoSearch } from "react-icons/go";
import { auth, db } from "../firebase";
import AddChatPrompt from "./AddChatPrompt";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import IconCompo from "./IconCompo";

function Header({ icons, className, setNoResult }) {
  const [addChatPrompt, setAddChatPrompt] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [fullScreen, setFullScreene] = useState(false);
  const [openCloseSearchBar, setOpenCloseSearchBar] = useState(false);

  const [user] = useAuthState(auth);

  const toggleFullScreen = () => {
    if (window.fullScreen) {
      document.exitFullscreen();
      setFullScreene(false);
    } else {
      var el = document.documentElement,
        rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen;
      rfs.call(el);
      setFullScreene(true);
    }
  };

  // Header Top Right User Drop down hook
  useEffect(() => {
    document.addEventListener("click", (e) => {
      const id = e.target.id;
      if (id !== "dropdown_click") {
        setDropdown(false);
      }
    });
    return window.removeEventListener("click", {}, false);
  });

  // Search Bar Hook
  useEffect(() => {
    const searchValueToLowerCase = searchValue.toLocaleLowerCase();
    document.querySelectorAll(".chatList").forEach((e) => {
      if (!searchValue) {
        e.classList.remove("hideChat");
        setNoResult(false);
        return null;
      }
      e.classList.add("hideChat");
      const contentToLowerCase = e.textContent.toLocaleLowerCase();
      if (contentToLowerCase.indexOf(searchValueToLowerCase) != -1) {
        setNoResult(false);
        e.classList.remove("hideChat");
      }
    });

    const checkNoResult =
      document.querySelectorAll(".hideChat").length ===
      document.querySelectorAll(".chatList").length;
    if (checkNoResult && searchValue) setNoResult(true);
  }, [searchValue]);

  // Handle Search Bar Func
  const handleSearch = () => {
    if (openCloseSearchBar) {
      setOpenCloseSearchBar(false);
      document.getElementById("searchInput").blur();
    } else {
      setOpenCloseSearchBar(true),
        document.getElementById("searchInput").focus();
    }
  };

  return (
    <>
      {addChatPrompt && <AddChatPrompt onComplete={setAddChatPrompt} />}

      <div
        className={`flex items-center relative bg-[#075E54] py-2 px-3 h-[52px] ${
          icons ? "justify-between" : "justify-center"
        } ${className || ""}`}
      >
        <div
          className="absolute left-0 top-0 w-full h-full bg-white border-b border-gray-300 z-10 flex items-center justify-between px-1"
          style={{
            clipPath: openCloseSearchBar
              ? "circle(100% at center)"
              : "circle(0% at calc(100% - 69px) 23px)",
            transition: openCloseSearchBar ? "0.3s linear" : "0.2s linear",
          }}
        >
          <div
            className="cursor-pointer text-gray-500 duration-150 hover:text-gray-700 hover:bg-gray-200 rounded-full overflow-hidden w-9 h-9 flex justify-center items-center"
            onClick={handleSearch}
          >
            <FiArrowLeft className="w-[21px] h-[21px]" />
          </div>
          <div className="flex-grow flex items-center">
            <input
              id="searchInput"
              type="text"
              className="border-none pl-3.5 pr-3 text-gray-900 outline-none w-full"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <div
          className={`min-h-[2rem] flex justify-center flex-col ${
            !icons && "items-center"
          }`}
        >
          <h1 className="text-white font-semibold leading-[14px] text-[1.15rem] tracking-wide">
            {icons ? "WhatsApp" : "Welcome to Whatsapp"}
          </h1>
          <p className="text-gray-300 text-xs mt-[2px]">By Saymon</p>
        </div>
        {icons && (
          <>
            <div className="flex items-center justify-center">
              <IconCompo
                Icon={fullScreen ? BiExitFullscreen : BiFullscreen}
                onClick={toggleFullScreen}
              />
              <IconCompo Icon={GoSearch} onClick={handleSearch} />
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ml-2"
                  onClick={() => setDropdown(true)}
                >
                  <img
                    src={user?.photoURL}
                    alt={user?.displayName[0] || user?.email[0]}
                    id="dropdown_click"
                    className="w-full h-full flex justify-center items-center font-medium text-gray-600 text-base uppercase bg-white object-cover"
                  />
                </div>

                <ul
                  id="dropdown"
                  className={`absolute top-0 right-0 w-[180px] bg-white z-[5] origin-top-right`}
                  style={{
                    boxShadow: "0 3px 10px 1px rgba(0,0,0,0.2)",
                    transform: dropdown ? "scale(1)" : "scale(0)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  <li
                    id="dropdown_li"
                    className="flex items-center py-2 px-3 cursor-pointer text-gray-800 hover:bg-gray-200"
                    onClick={() => setAddChatPrompt(true)}
                  >
                    <BsFillPersonPlusFill className="w-4 h-4 mr-3" />
                    Add new person
                  </li>
                  <li
                    id="dropdown_li"
                    className="flex items-center py-1.5 px-3 cursor-pointer text-gray-800 hover:bg-gray-200"
                    onClick={() => {
                      db.collection("users")
                        .doc(user?.uid)
                        .set({ online: false }, { merge: true })
                        .then(() => {
                          auth.signOut();
                        });
                    }}
                  >
                    <FiLogOut className="w-4 h-4 mr-3" /> Logout
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Header;
