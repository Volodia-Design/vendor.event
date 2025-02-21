import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Gallery from "./Gallery";
import Drive from "./Drive";
import UploadGallery from "./UploadGallery";

const tabs = [
  { id: "gallery", label: "Gallery", path: "/portfolio/gallery" },
  { id: "drive", label: "Drive", path: "/portfolio/drive" },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full flex flex-col items-start gap-3 bg-white p-3 rounded-2xl lg:px-6 px-2">

      <div className="w-full flex justify-start items-center gap-4 relative text-text2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="relative"
          >
            <div
              className={`cursor-pointer transition-all duration-200 ${
                activeTab === tab.id ? "text-secondary-700" : "text-primary2-500"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(tab.path);
              }}
            >
              {tab.label}
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-secondary-700 transition-all duration-200" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 w-full">
        <Routes>
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/crud" element={<UploadGallery />} />
          <Route path="drive" element={<Drive />} />
        </Routes>
      </div>
    </div>
  );
}