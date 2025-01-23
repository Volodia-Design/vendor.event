import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await api.get("/service-types");
        setServiceTypes(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServiceTypes();
  }, []);

  return { serviceTypes };
}
