import { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

export default function AddressInputComponent({
  value = {},
  onChange,
  id,
  label,
  error,
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries,
  });

  const [address, setAddress] = useState({
    fullAddress: value.fullAddress || "",
    country: value.country || "",
    city: value.city || "",
    state: value.state || "",
    postal_code: value.postal_code || "",
    lat: value.lat || "",
    lng: value.lng || "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setAddress({
      fullAddress: value.fullAddress || "",
      country: value.country || "",
      city: value.city || "",
      state: value.state || "",
      postal_code: value.postal_code || "",
      lat: value.lat || "",
      lng: value.lng || "",
    });
  }, [value]);

  const handleAddressChange = (e) => {
    const updatedAddress = { ...address, fullAddress: e.target.value };
    setAddress(updatedAddress);
    if (onChange) {
      onChange(updatedAddress);
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getQueryPredictions(
      { input: e.target.value },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        }
      }
    );
  };

  const handleSuggestionClick = (suggestion) => {
    const placeService = new window.google.maps.places.PlacesService(
      inputRef.current
    );

    const request = {
      placeId: suggestion.place_id,
      fields: ["formatted_address", "geometry", "address_component"],
    };

    placeService.getDetails(request, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        const newAddress = {
          fullAddress: place.formatted_address,
          country: "",
          city: "",
          state: "",
          postal_code: "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        place.address_components.forEach((component) => {
          if (component.types.includes("country")) {
            newAddress.country = component.long_name;
          }
          if (component.types.includes("locality")) {
            newAddress.city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            newAddress.state = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            newAddress.postal_code = component.long_name;
          }
        });

        setAddress(newAddress);
        setSuggestions([]);
        if (onChange) {
          onChange(newAddress);
        }
      }
    });
  };

  const handleBlur = () => {
    setTimeout(() => setSuggestions([]), 200);
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-text4Medium text-black-400 flex items-center"
        >
          {typeof label === "string" ? label : label}
        </label>
      )}
      <input
        type="text"
        id="address"
        ref={inputRef}
        placeholder="Country, city, street, zip code"
        value={address.fullAddress || ""}
        onChange={handleAddressChange}
        onBlur={handleBlur}
        className="mt-1 inputSelectStyle focus:outline-none placeholder-gray w-full px-3"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-b-md max-h-60 overflow-y-auto mt-1 z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-300"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}  {error && (
        <p className="text-red-500 text-text4Medium">{error}</p>
      )}
    </div>
  );
}
