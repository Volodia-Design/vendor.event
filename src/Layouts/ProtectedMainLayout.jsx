import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../store/useAuth";
import Header from "./Header";
import Sidebar from "./Sidebar";

function ProtectedMainLayout() {
  // const { isLoggedIn } = useAuth();

  let isLoggedIn = true


  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
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
