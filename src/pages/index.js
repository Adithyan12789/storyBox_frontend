"use client";
import { Inter } from "next/font/google";
import Login from "./login";
import Registration from "./Registration";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });
const Home = () => {
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get("api/admin/login/fetchLoginOrNot")
            .then((res) => {
                setLogin(res.data.login);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });

    }, []);
   
    if(loading) {
        return(<div className="mainLoaderBox loader-new bg-white">
            <div className="loading">
              <div className="d1"></div>
              <div className="d2"></div>
            </div>
          </div>)
    }else{
        return login ? <Login /> : <Registration />;
    }
};

export default Home;
