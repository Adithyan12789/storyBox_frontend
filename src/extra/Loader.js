import React from "react";
import { useSelector } from "react-redux";
import { isLoading } from "../util/ApiInstance";

export default function Loader() {
  const roleLoader = useSelector((state) => isLoading(state));
  return (
    <>
      {roleLoader && (
        <>
          <div className="mainLoaderBox loader-new">
            <div className="loading">
              <div className="d1"></div>
              <div className="d2"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
