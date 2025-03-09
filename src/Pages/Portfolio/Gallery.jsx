import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useModal from "../../store/useModal";
import useCurrentWidth from "../../utils/useCurrentWidth";
import UploadGallery from "./UploadGallery";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import useLoading from "../../store/useLoading";
import useSelfData from "../../store/data/useSelfData";
import { cn } from "../../utils";
import Pagination from "../../components/Pagination";
import GalleryMediaViewer from "./GalleryMediaViewer";

export default function Gallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const { userData } = useSelfData();
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
  const [selectedServiceType, setSelectedServiceType] = useState(0); // Default to "All"
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

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
    setSelectedServiceType(item.id); // Update selected service type
    setPaginationData((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
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
      const response = await api.get(`/gallery`, {
        params: {
          page: paginationData.currentPage,
          limit: paginationData.pageSize,
          serviceTypeId: selectedServiceType !== 0 ? selectedServiceType : undefined,
        },
      });

      const data = response.data.data.data;
      setPaginationData((prev) => ({
        ...prev,
        totalPages: response.data.data.total,
      }));

      const transformedData = await Promise.all(
        data.map(async (item) => {
          if (item.file?.filename) {
            try {
              const imageResponse = await api.get(`/image/${item.file.filename}`, {
                responseType: "blob",
              });
              item.image = URL.createObjectURL(imageResponse.data);
            } catch {
              item.image = null;
            }
          } else {
            item.image = null;
          }

          if (item.service_type?.image) {
            try {
              const serviceTypeImageResponse = await api.get(`/image/${item.service_type.image}`, {
                responseType: "blob",
              });
              item.service_type.serviceTypeImage = URL.createObjectURL(serviceTypeImageResponse.data);
            } catch {
              item.service_type.serviceTypeImage = null;
            }
          }

          return item;
        })
      );

      setMediaItems(transformedData);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    }
    setIsLoading(false);
  };

  const handlePageChange = (page) => {
    setPaginationData((prevData) => ({
      ...prevData,
      currentPage: page,
    }));
  };

  useEffect(() => {
    getMediaData();
    setNeedToRefetch(false);
  }, [needToRefetch, paginationData.currentPage, selectedServiceType]); // Re-fetch when filters or page change

  return (
    <div className="w-full">
      <div className="w-full flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
          {serviceTypes.map((item) => (
            <Button
              key={item.id}
              text={item.name}
              buttonStyles={cn(
                "px-4 py-2 text-text3Medium border border-neutral-200",
                selectedServiceType === item.id
                  ? "bg-primary2-500 text-white border-primary2-500"
                  : "hover:bg-neutral-50"
              )}
              onClick={() => handleServiceTypeFilter(item)}
            />
          ))}
        </div>

        <Button
          text="Upload"
          buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2 self-end"
          onClick={() =>
            handleCrud({ type: "create", data: null, galleryUpload: true, services: userData?.vendor?.service_types })
          }
        />
      </div>

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 mt-6">
          {mediaItems.map((item) => (
            <GalleryMediaViewer key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-72">
          <p className="text-text3Medium text-primary2-500">No Media found</p>
        </div>
      )}

      <div className="w-full flex justify-end">
        <Pagination paginationData={paginationData} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
