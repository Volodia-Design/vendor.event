import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useSelfData() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchSelf = async () => {
      try {
        const response = await api.get("/auth/self");
        setUserData(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSelf();
  }, []);

  return { userData };
}
