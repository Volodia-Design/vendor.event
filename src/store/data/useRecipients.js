import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function useRecipients() {
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await api.get("/recipient");
        setRecipients(response.data.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipients();
  }, []);

  return { recipients };
}
