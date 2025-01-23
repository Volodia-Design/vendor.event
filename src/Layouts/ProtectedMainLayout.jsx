// ProtectedMainLayout.js
import { Outlet } from "react-router-dom";
import useAuth from "../store/useAuth";
import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function ProtectedMainLayout() {
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      const params = new URLSearchParams(window.location.search);
      const newToken = params.get("token");

      if (newToken) {
        login(newToken); 
        window.history.replaceState({}, document.title, window.location.pathname); 
      }
    } else {
      login(token); 
    }
  }, [login]);

  if (!isLoggedIn) {
    return
  }

  return (
    <div className="flex gap-3 w-full h-screen">
      <Sidebar />
      <div className="px-1 py-3 mx-3 w-full flex flex-col items-center gap-3 overflow-auto">
        <Header />
        <div className="mt-8 w-[97%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProtectedMainLayout;