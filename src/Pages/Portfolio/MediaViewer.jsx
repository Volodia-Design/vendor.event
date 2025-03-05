import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Fullscreen, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useApiImage } from "../../utils/useApiImage";
import Spinner from "../../components/Spinner";

export default function MediaViewer({ item }) {
  const mediaItems = item.files;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = mediaItems[currentIndex];
  console.log("🚀 ~ MediaViewer ~ currentItem:", currentItem);
  const { imageUrl, isImageLoading } = useApiImage(currentItem?.filename);
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
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
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <Spinner isLoading={isImageLoading && isOpen} />
      <div className='relative rounded-xl'>
        {item.createdAt && (
          <div className='absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 text-text3Medium rounded-md drop-shadow-md'>
            {formatDate(item.createdAt)}
          </div>
        )}
        <Button
          className='absolute top-2.5 px-4 right-3 text-white w-[38px] h-[38px] bg-black-900/40 hover:bg-black-900/60'
          onClick={() => openModal(0)}
        >
          <Fullscreen className='scale-[2.2]' strokeWidth={1.4} />
        </Button>
        <img
          src={item.image}
          alt={item.name}
          className='w-full h-72 object-cover rounded-xl'
        />

        {isOpen && (
          <div className='fixed inset-0 z-40 bg-gray-950/80 flex items-center justify-center w-full h-full'>
            <Button
              className='absolute top-2 right-2 text-white/80 rounded-full hover:bg-gray-950/70 bg-gray-950/50'
              size='icon'
              onClick={closeModal}
            >
              <X className='w-6 h-6 scale-125' />
            </Button>
            <Button
              className='absolute left-2 bg-gray-950/50 text-white/80 rounded-full hover:bg-gray-950/70'
              size='icon'
              onClick={showPrev}
            >
              <ChevronLeft className='w-6 h-6 scale-150' />
            </Button>
            {currentItem && currentItem.mimetype.startsWith("image/") ? (
              <img
                src={imageUrl}
                alt={currentItem.originalname}
                className='max-w-full max-h-full object-contain'
              />
            ) : (
              currentItem && (
                <video
                  src={imageUrl}
                  controls
                  autoPlay
                  className='max-w-full max-h-full object-contain'
                />
              )
            )}
            <Button
              className='absolute right-2 text-white/80 rounded-full bg-gray-950/50 hover:bg-gray-950/70'
              size='icon'
              onClick={showNext}
            >
              <ChevronRight className='w-6 h-6 scale-150' />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
