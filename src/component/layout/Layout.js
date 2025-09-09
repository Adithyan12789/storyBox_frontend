"use client";
import { Providers } from "@/Provider";
import { useCallback, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = ({ children }) => {

  return (
    <Providers>
      <div className="mainContainer d-flex w-100">
        <div className="containerLeft">
          <Sidebar />
        </div>
        <div className="containerRight w-100 ">
          <Navbar />
          <div className="mainAdmin ml-4">
            <div className="mobSidebar-bg  d-none"></div>
            <main className="comShow">{children}</main>
          </div>
        </div>
      </div>
    </Providers>
  );
};

export default RootLayout;
