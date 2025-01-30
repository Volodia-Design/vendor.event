import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useLocations() {
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get(`/location?page=1&limit=10000000`);
        setLocations(response.data.data.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
    

    fetchLocations();
  }, []);

  return { locations };
}
