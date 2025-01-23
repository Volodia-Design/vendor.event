import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useSelfData() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await api.get("/auth/self");
        console.log("🚀 ~ fetchServiceTypes ~ response:", response)
        setUserData(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServiceTypes();
  }, []);

  return { userData };
}
