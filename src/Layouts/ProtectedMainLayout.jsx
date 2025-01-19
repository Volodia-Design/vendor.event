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
    <div className="flex w-full h-screen">
      <Sidebar />
      <div className="p-4 w-full flex flex-col items-center overflow-auto">
        <Header />
        <div className="mt-8 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProtectedMainLayout;
