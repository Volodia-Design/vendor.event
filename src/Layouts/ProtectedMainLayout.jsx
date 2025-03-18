// ProtectedMainLayout.js
import { Outlet } from "react-router-dom";
import useAuth from "../store/useAuth";
import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Spinner from "../components/Spinner";

function ProtectedMainLayout() {
  // const { isLoggedIn, login } = useAuth();
  // const [isAuthenticating, setIsAuthenticating] = useState(true);

  // useEffect(() => {
  //   async function checkAuth() {
  //     const token = localStorage.getItem("authToken");
  //     if (token) {
  //       await login(token);
  //       setIsAuthenticating(false);
  //     } else {
  //       const params = new URLSearchParams(window.location.search);
  //       const newToken = params.get("token");

  //       if (newToken) {
  //         await login(newToken);
  //         window.history.replaceState({}, document.title, window.location.pathname);
  //         setIsAuthenticating(false);
  //       } else {
  //         // No token found at all
  //         setIsAuthenticating(false);
  //       }
  //     }
  //   }

  //   checkAuth();
  // }, [login]);

  // if (isAuthenticating) {
  //   return <Spinner />;
  // }

  // if (!isLoggedIn && !isAuthenticating) {
  //   window.location.href = import.meta.env.VITE_HOME_PAGE;
  //   return null;
  // }

  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <div className="lg:p-4 w-full flex flex-col items-center overflow-auto">
        <Header />
        <div className="mt-8 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProtectedMainLayout;