import { useState, useEffect } from "react";
import api from "./api";

export const useApiImage = (imagePath) => {
  const [imageUrl, setImageUrl] = useState("/NoImage.webp");
  const [isImageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (!imagePath || imagePath.trim() === "") {
      setImageUrl("/NoImage.webp");
      setImageLoading(false);
      return;
    }

    const fetchImage = async () => {
      setImageLoading(true);
      try {
        const response = await api.get(`/image/${imagePath}`, {
          responseType: "blob",
        });
        const url = URL.createObjectURL(response.data);

        if (url) {
          setImageUrl(url);
        }
      } catch (err) {
        console.error(err);
        setImageUrl("/NoImage.webp");
      } finally {
        setImageLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl && imageUrl !== "/NoImage.webp") {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imagePath]);

  return { imageUrl, isImageLoading };
};
