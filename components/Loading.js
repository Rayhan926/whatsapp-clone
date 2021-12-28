import Header from "../components/Header";
import Layout from "./../components/Layout";
import PuffLoader from "react-spinners/PuffLoader";
import Head from "next/head";
function Loading({ icons }) {
  return (
    <>
      <Head>
        <title>Loading..</title>
      </Head>
      <Layout className="flex flex-col">
        <Header icons={icons} />
        <div className="w-full flex flex-col justify-center items-center flex-grow">
          <PuffLoader color="#075E54" />
        </div>
      </Layout>
    </>
  );
}

export default Loading;
