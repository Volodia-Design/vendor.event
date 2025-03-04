import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Fullscreen, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useApiImage } from "../../utils/useApiImage";
import Spinner from "../../components/Spinner";

const mockItem = {
  id: 13,
  thumbnail: 42,
  createdAt: "2025-02-26T16:27:32.767Z",
  updatedAt: "2025-02-26T16:27:32.767Z",
  serviceTypeId: 2,
  vendorId: 2,
  files: [
    {
      id: 39,
      filename: "1740587249019.jpeg",
      originalname: "297x170_tech.jpeg",
      mimetype: "image/jpeg",
      size: 11839,
      createdAt: "2025-02-26T16:27:29.074Z",
      updatedAt: "2025-02-26T16:27:29.074Z",
    },
    {
      id: 40,
      filename: "1740587249471.jpg",
      originalname: "640x480_pexels-energepic-com.jpg",
      mimetype: "image/jpeg",
      size: 28976,
      createdAt: "2025-02-26T16:27:29.486Z",
      updatedAt: "2025-02-26T16:27:29.486Z",
    },
    {
      id: 41,
      filename: "1740587250126.jpg",
      originalname: "1280x1924_pexels-fotis-michalainas].jpg",
      mimetype: "image/jpeg",
      size: 207753,
      createdAt: "2025-02-26T16:27:30.162Z",
      updatedAt: "2025-02-26T16:27:30.162Z",
    },
  ],
  file: {
    id: 42,
    filename: "1740587251949.jpg",
    originalname: "4288x2848_pexels-pixabay.jpg",
    mimetype: "image/jpeg",
    size: 1563500,
    createdAt: "2025-02-26T16:27:32.318Z",
    updatedAt: "2025-02-26T16:27:32.318Z",
  },
  service_type: {
    id: 2,
    name: "Photo",
    description: null,
    published: 0,
    border: "#9328cc",
    background: "#eebebe",
    image: "1740144532007.png",
    createdAt: "2025-02-21T13:28:52.014Z",
    updatedAt: "2025-02-21T13:28:52.014Z",
    serviceTypeImage:
      "blob:http://localhost:5174/1d10e399-3eaf-446b-9100-cc36ed498995",
  },
  image: "blob:http://localhost:5174/ec87003e-f1e1-45d9-ad37-6d90e3f12e1f",
};

export default function MediaViewer({ item }) {
  const mediaItems = item.files;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = mediaItems[currentIndex];
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
                alt={currentItem.name}
                className='max-w-full max-h-full object-contain'
              />
            ) : (
              currentItem && (
                <video
                  src={currentItem.image}
                  controls
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
