import { useEffect, useState } from "react";
import useActiveTab from "../store/useActiveTab";
import useAuth from "../store/useAuth";
import { useApiImage } from "../utils/useApiImage";
import sidebarItems from "../utils/sidebarItems";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { user } = useAuth();
  const { imageUrl } = useApiImage(user?.image);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { activeTab, setActiveTab } = useActiveTab();

  useEffect(() => {
    const currentTab = sidebarItems.find((item) => {
      if (item.path === location.pathname) {
        return true;
      }
      if (
        item.path.startsWith("/products") &&
        location.pathname.startsWith("/products")
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
    window.location.href = "https://eml-gishyans-projects.vercel.app/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu state
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between w-full bg-white p-3 rounded-lg">
        <p className="text-text1Medium text-primary2-500 uppercase">{activeTab}</p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-secondary-700 flex items-center justify-center">
            <img
              src="/Images/ComponentIcons/Notification.svg"
              alt="notification"
              className="w-6 h-6 cursor-pointer"
            />
          </div>
          <img
            src={imageUrl}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden flex-col items-center justify-between w-full">
        <div className="flex items-center justify-between w-full bg-black-900 p-4">
          {/* Left Side: Logo/Go Main Page */}
          <div
            className="flex justify-start items-center gap-3 cursor-pointer"
            onClick={handleGoMainPage}
          >
            <img src="/Logo.svg" alt="Logo" className="h-10" />
            <p className="text-text2Bold text-white">Event my Life</p>
          </div>

          {/* Right Side: Hamburger Icon */}
          <div
            className={`rounded-lg p-2 cursor-pointer flex flex-col items-center justify-center w-10 h-10 ${
              isMenuOpen ? "bg-black" : "border"
            }`}
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <div className="text-xl text-white font-bold">X</div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="w-6 h-[3px] bg-white rounded-lg"></div>
                <div className="w-6 h-[3px] bg-white rounded-lg"></div>
                <div className="w-6 h-[3px] bg-white rounded-lg"></div>
              </div>
            )}
          </div>
        </div>

     

        {/* Mobile Menu (appears when isMenuOpen is true) */}
        {isMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 bg-black-900 p-3 flex flex-col gap-3 z-50">
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
                    <div
                      className={`w-full p-2 rounded-md text-left ${
                        isActive ? "bg-white text-black" : "text-white"
                      } hover:bg-gray-100 transition duration-300 ease-in-out`}
                    >
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
           {/* User Info (always visible at the bottom) */}
           <div className="w-full flex items-center justify-between p-4 bg-white">
        <p className="text-text1Medium text-primary2-500 uppercase">{activeTab}</p>

          {user ? (
            <div className="cursor-pointer flex items-center gap-2">
              <img
                src={imageUrl}
                alt="User Profile"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-white">{user?.name}</p>
            </div>
          ) : (
            <div className="text-white">Sign In</div>
          )}
        </div>
      </div>
    </>
  );
}
