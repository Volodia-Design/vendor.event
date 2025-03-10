import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Fullscreen, X, ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useApiImage } from "../../utils/useApiImage";
import Spinner from "../../components/Spinner";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import useModal from "../../store/useModal";
import { GoVideo } from "react-icons/go";

export default function DriveMediaViewer({ item, allItems = [], initialIndex = 0, onDelete }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isOpen, setIsOpen] = useState(false);
  const currentItem = isOpen ? allItems[currentIndex] : item;
  const { imageUrl, isImageLoading } = useApiImage(currentItem?.file?.filename);
  const { id: folderId } = useParams();
  const { openDeleteModal, showSuccess, showError } = useModal();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openModal = () => {
    setCurrentIndex(initialIndex);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      } else if (event.key === "ArrowLeft" && isOpen) {
        showPrev();
      } else if (event.key === "ArrowRight" && isOpen) {
        showNext();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const showPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allItems.length - 1 : prevIndex - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === allItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle delete functionality
  const handleDelete = () => {
    openDeleteModal({
      title: "Delete Media",
      message: "Are you sure you want to delete this media?",
      onConfirm: async () => {
        try {
          await api.delete(`/content/${folderId}/${item.id}`);
          showSuccess("Media deleted successfully");
          if (typeof onDelete === "function") {
            onDelete();
          }
        } catch (error) {
          console.error("Error deleting media:", error);
          showError("Failed to delete media");
        }
      },
    });
  };

  // Use the blob URL if it's already provided, otherwise use the API image
  let displayImage;
  if (item.file?.mimetype?.startsWith("image")) {
    displayImage = item.image || imageUrl;
  } else if (item.file?.mimetype?.startsWith("video")) {
    displayImage = <GoVideo className="w-12 h-12" />;
  }

  const modalImageUrl = currentItem.image || (isOpen ? useApiImage(currentItem?.file?.filename)?.imageUrl : null);

  // Only show navigation buttons when there are multiple items
  const showNavigation = allItems.length > 1;

  return (
    <>
      <Spinner isLoading={isImageLoading && isOpen} />
      <div className='relative rounded-xl'>
        {item?.createdAt && (
          <div className='absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 text-text3Medium rounded-md drop-shadow-md'>
            {formatDate(item.createdAt)}
          </div>
        )}
        <Button
          className='absolute top-2.5 px-4 right-3 text-white w-[38px] h-[38px] bg-black-900/40 hover:bg-black-900/60'
          onClick={openModal}
        >
          <Fullscreen className='scale-[2.2]' strokeWidth={1.4} />
        </Button>
        <Button
          className='absolute top-2.5 px-4 right-16 text-white w-[38px] h-[38px] bg-black-900/40 hover:bg-black-900/60'
          onClick={() => handleDelete(item)}
        >
          <Trash className='scale-[2.2]' strokeWidth={1.4} />
        </Button>
        <div className="w-full h-72 object-cover rounded-xl">
          {/* Display either image or video placeholder */}
          {displayImage && typeof displayImage === 'string' ? (
            <img src={displayImage} alt={item.file?.originalname || "Media"} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-xl">
              {displayImage}
            </div>
          )}
        </div>

        {isOpen && (
          <div className='fixed inset-0 z-40 bg-gray-950/80 flex items-center justify-center w-full h-full'>
            <Button
              className='absolute top-2 right-2 text-white/80 rounded-full hover:bg-gray-950/70 bg-gray-950/50'
              size='icon'
              onClick={closeModal}
            >
              <X className='w-6 h-6 scale-125' />
            </Button>

            {showNavigation && (
              <Button
                className='absolute left-2 bg-gray-950/50 text-white/80 rounded-full hover:bg-gray-950/70'
                size='icon'
                onClick={showPrev}
              >
                <ChevronLeft className='w-6 h-6 scale-150' />
              </Button>
            )}

            {currentItem?.file?.mimetype?.startsWith("image/") ? (
              <img
                src={modalImageUrl}
                alt={currentItem.file?.originalname || "Image"}
                className='max-w-full max-h-full object-contain'
              />
            ) : (
              currentItem?.file && (
                <video
                  src={modalImageUrl}
                  controls
                  autoPlay
                  className='max-w-full max-h-full object-contain'
                />
              )
            )}

            {showNavigation && (
              <Button
                className='absolute right-2 text-white/80 rounded-full bg-gray-950/50 hover:bg-gray-950/70'
                size='icon'
                onClick={showNext}
              >
                <ChevronRight className='w-6 h-6 scale-150' />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
