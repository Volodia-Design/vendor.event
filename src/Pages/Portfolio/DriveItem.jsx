import { useEffect, useState, useRef } from "react";
import api from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import useLoading from "../../store/useLoading";
import Pagination from "../../components/Pagination";
import DriveMediaViewer from "./DriveMediaViewer";
import useModal from "../../store/useModal";
import useCurrentWidth from "../../utils/useCurrentWidth";
import UploadGallery from "./UploadGallery";

export default function DriveItem() {
  const id = useParams().id;
  const [mediaItems, setMediaItems] = useState([]);
  const { setIsLoading } = useLoading();
  const fileInputRef = useRef(null);
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
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const fetchDriveItem = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/content/${id}`, {
        params: {
          page: paginationData.currentPage,
          limit: paginationData.pageSize,
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
              const imageResponse = await api.get(
                `/image/${item.file.filename}`,
                {
                  responseType: "blob",
                }
              );
              item.image = URL.createObjectURL(imageResponse.data);
            } catch {
              item.image = null;
            }
          } else {
            item.image = null;
          }
          return item;
        })
      );

      setMediaItems(transformedData);
    } catch (error) {
      console.error("Error fetching drive item:", error);
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
    fetchDriveItem();
    setNeedToRefetch(false);
  }, [needToRefetch, paginationData.currentPage]);

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
      navigate(`/portfolio/drive/${id}/upload`, { state: props });
    }
  };

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        await api.put(`/content/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchDriveItem();
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  return (
    <div className='w-full'>
      <div className='w-full flex items-center justify-between'>
        <Button
          text='Back'
          imgSrc='/Images/ComponentIcons/PaginationArrow.svg'
          buttonStyles='bg-primary2-50/50 hover:bg-primary2-50/100 border border-primary2-50'
          imgAlt='Back'
          onClick={() => window.history.back()}
        />
         <Button
                 text="Upload"
                 buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2 self-end"
                 onClick={() =>
                   handleCrud({ type: "create", data: null, driveUpload: true, driveUploadId: id })
                 }
               />
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*,video/*'
          multiple
          className='hidden'
          onChange={handleUpload}
        />
      </div>
      {mediaItems.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 mt-6'>
          {mediaItems.map((item, index) => (
            <DriveMediaViewer
              key={item.id}
              item={item}
              allItems={mediaItems}
              initialIndex={index}
              onDelete={fetchDriveItem}
            />
          ))}
        </div>
      ) : (
        <div className='flex justify-center items-center h-72'>
          <p className='text-text3Medium text-primary2-500'>No Media found</p>
        </div>
      )}
      <div className='w-full flex justify-end'>
        <Pagination
          paginationData={paginationData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}