import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useProductTypes() {
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await api.get("/product-type");
        setProductTypes(response.data.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductTypes();
  }, []);

  return { productTypes };
}
