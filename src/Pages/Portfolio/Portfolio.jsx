import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const tabs = [
  { path: "gallery", label: "Gallery" },
  { path: "drive", label: "Drive" },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.includes("drive") ? "drive" : "gallery";

  return (
    <div className='w-full flex flex-col items-start gap-1 sm:gap-3 bg-white p-8 rounded-2xl lg:px-8 px-6 pt-4 sm:pt-8'>
      <div className='w-full flex justify-start items-center gap-4 relative text-text2'>
        {tabs.map((tab) => (
          <div key={tab.path} className='relative'>
            <div
              className={`cursor-pointer transition-all duration-200 ${
                currentTab === tab.path
                  ? "text-secondary-700"
                  : "text-primary2-500"
              }`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </div>
            {currentTab === tab.path && (
              <div className='absolute bottom-0 left-0 w-full h-[1px] bg-secondary-700 transition-all duration-200' />
            )}
          </div>
        ))}
      </div>
      <div className='mt-4 w-full'>
        <Outlet />
      </div>
    </div>
  );
}
