import { auth, provider } from "../firebase";
import Header from "./Header";
import Layout from "./Layout";
function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Layout className="flex flex-col">
      <Header icons={false} />
      <div className="w-full flex flex-col justify-center items-center flex-grow">
        <div className="w-[125px]">
          <img src="/img/logo.png" alt="Whatsapp" />
        </div>
        <p className="text-gray-500 font-medium mt-2 mb-4">
          End to End not encrypted :)
        </p>
        <button
          className="border-none outline-none py-2 pt-[6px] rounded-sm px-5 bg-[#075E54] duration-150 hover:bg-[#094e46] text-white"
          onClick={signIn}
        >
          Sign in with Google
        </button>
      </div>
    </Layout>
  );
}

export default Login;
