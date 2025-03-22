import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useVendorService() {
  const [vendorService, setVendorService] = useState([]);

  useEffect(() => {
    const fetchVendorService = async () => {
      try {
        const response = await api.get("/vendor-service");
        setVendorService(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVendorService();
  }, []);

  return { vendorService };
}
