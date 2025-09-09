"use-client";
import { useEffect } from "react";
import { useRouter } from "next/router";


const AuthCheck = (props) => {
  const router = useRouter();

  let isAuth = "";
  if (typeof window !== "undefined") {
    isAuth = sessionStorage.getItem("isAuth");
  }
  useEffect(() => {
    if (!isAuth || isAuth !== "true") {
      router.push("/");
    }
  }, [isAuth]);

  return <>{props.children}</>;
};

export default AuthCheck;
