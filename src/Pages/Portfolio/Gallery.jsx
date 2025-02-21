import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useModal from "../../store/useModal";
import useCurrentWidth from "../../utils/useCurrentWidth";
import UploadGallery from "./UploadGallery";
import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function Gallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const { isDesktop } = useCurrentWidth();
  const {
    onOpen,
    needToRefetch,
    setNeedToRefetch,
    openDeleteModal,
    showSuccess,
    showError,
  } = useModal();
  const navigate = useNavigate();

  const handleCrud = (action) => {
    const props =
      action.type === "create"
        ? { action }
        : { action, editableService: action.data };
    if (isDesktop) {
      onOpen(
        <UploadGallery {...props} />,"!max-w-2xl max-h-[99vh] overflow-auto"
      );
    } else {
      navigate("/portfolio/gallery/crud", { state: props });
    }
  };

  const getMediaData = async () => {
    try {
      const response = await api.get("/gallery");
      const data = response.data.data.data;
  
      const transformedData = await Promise.all(
        data.map(async (item) => {
          if (item.file && item.file.filename) {
            try {
              const imageResponse = await api.get(`/image/${item.file.filename}`, {
                responseType: "blob",
              });
              const imageUrl = URL.createObjectURL(imageResponse.data);
              return { ...item, image: imageUrl };
            } catch (error) {
              console.error("Error loading image for file:", item.file.filename, error);
              return { ...item, image: null }; 
            }
          } else {
            console.warn("Missing file or filename for item:", item);
            return { ...item, image: null }; 
          }
        })
      );
  
      setMediaItems(transformedData);
    } catch (error) {
      console.log("Error fetching gallery data:", error);
    }
  };

  // Function to format the date as "12 Nov, 2024"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    getMediaData();
    setNeedToRefetch(false);
  }, [needToRefetch]);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        {mediaItems.length > 0 ? (
          <p>Services</p>
        ) : (
          <p className="text-text3Medium text-primary2-500">No Media found</p>
        )}
        <Button
          text="Upload"
          buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2"
          onClick={() => handleCrud({ type: "create", data: null })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 mt-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="relative rounded-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-72 object-cover rounded-xl"
            />
            {item.createdAt && (
              <div className="absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 text-text3Medium rounded-md">
                {formatDate(item.createdAt)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
