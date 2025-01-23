import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useEventTypes() {
const [eventTypes, setEventTypes] = useState([])
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await api.get("/event-type");
        setEventTypes(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEventTypes();
  }, []);

  return { eventTypes };
}
