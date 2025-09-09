"use client";
import { Providers } from "../Provider";
import "../assets/css/dateRange.css";
import "../assets/css/default.css";
import "../assets/css/custom.css";
import "../assets/css/responsive.css";
import "../assets/css/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseURL, secretKey } from "../util/config";
import Loader from "../extra/Loader";
import AuthCheck from "./AuthCheck";
import { useEffect } from "react";
// import Head from "next/head";

export default function App({ Component, pageProps }) {
  const getToken =
    typeof window !== "undefined" && localStorage.getItem("token");
  const getLayout = Component.getLayout || ((page) => page);
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common["key"] = secretKey;
  axios.defaults.headers.common["Authorization"] = getToken
    ? `${getToken}`
    : "";

  // useEffect(() => {
  //   warmUpRoutes();
  // }, []);

  return getLayout(
    <>
      {/* <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      </Head> */}
      <AuthCheck>
        <Providers>
          <ToastContainer />
          <Component {...pageProps} />
          <Loader />
        </Providers>
      </AuthCheck>
    </>
  );
}
