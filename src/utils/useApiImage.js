import { useState, useEffect } from 'react';
import api from './api';

export const useApiImage = (imagePath) => {
  const [imageUrl, setImageUrl] = useState("/NoImage.webp"); 

  useEffect(() => {
    if (!imagePath || imagePath.trim() === "") {
      setImageUrl("/NoImage.webp");
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await api.get(`/image/${imagePath}`, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(response.data);

        if (url) {
          setImageUrl(url);
        }
      } catch (err) {
        console.error(err);
        setImageUrl("/NoImage.webp");
      }
    };

    fetchImage();

    return () => {
      if (imageUrl && imageUrl !== "/NoImage.webp") {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imagePath]);

  return { imageUrl };
};