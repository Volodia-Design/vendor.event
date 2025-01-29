import { useState } from "react";

export default function useLocations() {
const [locations, setLocations] = useState([
    { id: 1, name: "New York" },
    { id: 2, name: "London" },
    { id: 3, name: "Paris" },
    { id: 4, name: "Tokyo" },
    { id: 5, name: "Sydney" },
  ])

  return { locations };
}
