// useClearSessionStorageOnPopState.ts
import { useEffect } from "react";

const useClearSessionStorageOnPopState = (key) => {
  useEffect(() => {
    const handlePopState = () => {
      // Clear specific value from session storage

      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    };

    // Add event listener
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [key]);
};

export default useClearSessionStorageOnPopState;
