import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";

import useModal from "../../store/useModal";
import useCurrentWidth from "../../utils/useCurrentWidth";
import UploadGallery from "./UploadGallery";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import useLoading from "../../store/useLoading";
import useSelfData from "../../store/data/useSelfData";
import { cn } from "../../utils";
import MediaViewer from "./MediaViewer";

export default function Gallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const { userData } = useSelfData();
  const [searchParams, setSearchParams] = useSearchParams();

  const serviceType = searchParams.get("service-type");
  const { isDesktop } = useCurrentWidth();
  const {
    onOpen,
    needToRefetch,
    setNeedToRefetch,
    openDeleteModal,
    showSuccess,
    showError,
  } = useModal();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const serviceTypes = [
    {
      id: 0,
      name: "All",
      description: null,
      published: 0,
      border: "#426893",
      background: "#03356f",
    },
    ...(userData?.vendor?.service_types || []),
  ];

  const handleServiceTypeFilter = (item) => {
    if (item.id === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ "service-type": item.id });
    }
    getMediaData();
  };

  const handleCrud = (action) => {
    const props =
      action.type === "create"
        ? { action }
        : { action, editableService: action.data };
    if (isDesktop) {
      onOpen(
        <UploadGallery {...props} />,
        "!max-w-2xl max-h-[99vh] overflow-auto"
      );
    } else {
      navigate("/portfolio/gallery/upload", { state: props });
    }
  };

  const getMediaData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/gallery", {
        params: {
          service_type_id: serviceType,
        },
      });
      const data = response.data.data.data;

      const transformedData = await Promise.all(
        data.map(async (item) => {
          // Process the file image
          if (item.file && item.file.filename) {
            try {
              const imageResponse = await api.get(
                `/image/${item.file.filename}`,
                {
                  responseType: "blob",
                }
              );
              const imageUrl = URL.createObjectURL(imageResponse.data);
              item.image = imageUrl; // Attach image directly to item
            } catch (error) {
              console.error(
                "Error loading image for file:",
                item.file.filename,
                error
              );
              item.image = null;
            }
          } else {
            console.warn("Missing file or filename for item:", item);
            item.image = null;
          }

          // Process the service type image
          if (item.service_type && item.service_type.image) {
            try {
              const serviceTypeImageResponse = await api.get(
                `/image/${item.service_type.image}`,
                {
                  responseType: "blob",
                }
              );
              item.service_type.serviceTypeImage = URL.createObjectURL(
                serviceTypeImageResponse.data
              );
            } catch (error) {
              console.error(
                "Error loading image for service type:",
                item.service_type.image,
                error
              );
              item.service_type.serviceTypeImage = null;
            }
          }

          return item; // Return the item with both file and service type images attached
        })
      );

      setMediaItems(transformedData);
    } catch (error) {
      console.log("Error fetching gallery data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getMediaData();
    setNeedToRefetch(false);
  }, [needToRefetch]);

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col sm:flex-row justify-between gap-4 sm:gap-2'>
        <div className='flex gap-2 overflow-x-auto custom-scrollbar'>
          {serviceTypes.map((item) => (
            <Button
              key={item.id}
              text={item.name}
              buttonStyles={cn(
                "px-4 py-2 text-text3Medium border border-neutral-200",
                serviceType == item.id || (!serviceType && item.id == 0)
                  ? "bg-primary2-500 text-white border-primary2-500"
                  : "hover:bg-neutral-50"
              )}
              onClick={() => handleServiceTypeFilter(item)}
            />
          ))}
        </div>

        <Button
          text='Upload'
          buttonStyles='bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2 self-end'
          onClick={() => handleCrud({ type: "create", data: null })}
        />
      </div>

      {mediaItems.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 mt-6'>
          {mediaItems.map((item) => (
            <MediaViewer key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className='flex justify-center items-center h-72'>
          <p className='text-text3Medium text-primary2-500'>No Media found</p>
        </div>
      )}
    </div>
  );
}
