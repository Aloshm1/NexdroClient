import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Script from "next/script";
import DefaultLayout from "../components/layouts/DefaultLayout";
import Head from "next/head";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic"
const Footer = dynamic(()=>import('../components/Footer'))

const code = process.env.NEXT_PUBLIC_CODE;
function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;
  useEffect(() => {
    // console.log = function(){}
    // console.error = function(){}
    // console.warning = function(){}
    setData(localStorage.getItem("msg"));
  }, []);
  let [data, setData] = useState("");
  let [msg, setmsg] = useState("");
  let setM = () => {
    localStorage.setItem("msg", msg);
    setData(msg);
    if (msg !== code) {
      document.getElementById("message_error").style.display = "block";
    }
    setmsg("");
  };
  let [temp, setTemp] = useState(false);
  let loadData = (data) => {
    setTemp(!temp);
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDaqkL3sFmHLZnWKa72VU2QkrtbTNpdr0E&libraries=places`}
        strategy="beforeInteractive"
      ></Script>
      <Navbar nav={"Hii"} load={temp} />
      <Layout>
        <Component {...pageProps} test="test" reload={loadData} />
      </Layout>
      <Footer />
    </>
  );
}

export default MyApp;
