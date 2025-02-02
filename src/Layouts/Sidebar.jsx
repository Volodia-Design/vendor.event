import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import sidebarItems from "../utils/sidebarItems";
import useActiveTab from "../store/useActiveTab";
import api from "../utils/api";
import useLoading from "../store/useLoading";

export default function Sidebar() {
  const location = useLocation();
  const { activeTab, setActiveTab } = useActiveTab();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const currentTab = sidebarItems.find((item) => {
      if (item.path === location.pathname) {
        return true;
      }
      if (
        (item.path.startsWith("/products") &&
          location.pathname.startsWith("/products")) ||
        (item.path.startsWith("/service") &&
          location.pathname.startsWith("/service"))
      ) {
        return true;
      }
      return false;
    });

    if (currentTab) {
      setActiveTab(currentTab.name);
    }
  }, [location.pathname, setActiveTab]);

  const handleGoMainPage = () => {
    window.open(import.meta.env.VITE_HOME_PAGE, "_blank");
  };

  const handleLogout = () => {
    setIsLoading(true);
    api
      .post("/auth/sign-out")
      .then(() => {
        localStorage.removeItem("authToken");
        window.location.href = import.meta.env.VITE_HOME_PAGE_LOGOUT
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="hidden lg:block p-4 h-full w-full max-w-80">
      <div
        className={`bg-primary2-900 h-full pl-4 py-4 rounded-md flex flex-col justify-between`}
      >
        <div className="flex flex-col gap-4">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActiveTab(item.name)}
                className="flex items-center gap-3"
              >
                <div className={`p-2 rounded-md ${isActive ? "bg-white" : ""}`}>
                  <img
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.name}
                    className="w-8 h-8"
                  />
                </div>
                <div
                  className={`w-full p-2 rounded-bl-md rounded-tl-md ${
                    isActive
                      ? "text-black bg-white text-text2Medium"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto">
          <div
            onClick={() => handleLogout()}
            className="flex justify-center items-center gap-3 p-4 cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <img
                src="/Images/SidebarIcons/Logout.svg"
                alt="Logo"
                className="h-6"
              />
              <p className="text-text3 text-white">Log out</p>
            </div>
          </div>
          <div
            onClick={() => handleGoMainPage()}
            className="flex justify-center items-center gap-3 p-4 rounded-2xl bg-[#192634] mr-4 hover:bg-black-100/40  duration-300 ease-in-out cursor-pointer"
          >
            <img src="/Logo.svg" alt="Logo" className="h-10" />
            <p className="text-text2Bold text-white">Event my Life</p>
          </div>
        </div>
      </div>
    </div>
  );
}
