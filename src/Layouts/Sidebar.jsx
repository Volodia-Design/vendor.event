import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import sidebarItems from "../utils/sidebarItems";
import useActiveTab from "../store/useActiveTab";

export default function Sidebar() {
  const location = useLocation();
  const { activeTab, setActiveTab } = useActiveTab();

  useEffect(() => {
    const currentTab = sidebarItems.find((item) => {
      if (item.path === location.pathname) {
        return true;
      }
      if (item.path.startsWith("/products") && location.pathname.startsWith("/products")) {
        return true;
      }
      return false;
    });

    if (currentTab) {
      setActiveTab(currentTab.name);
    }
  }, [location.pathname, setActiveTab]);


  return (
    <div className="p-4 h-full w-full max-w-80">
      <div
        className={`bg-primary2-900 h-full pl-4 py-4 rounded-md flex flex-col gap-4`}
      >
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
    </div>
  );
}
