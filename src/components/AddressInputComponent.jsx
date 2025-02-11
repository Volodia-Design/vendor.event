import { useState, useEffect } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { InputComponent } from "./InputComponent";

const libraries = ["places"];

export default function AddressInputComponent({ value = {}, onChange }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries,
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState({
    fullAddress: value.fullAddress || "",
    country: value.country || "",
    city: value.city || "",
    state: value.state || "",
    postal_code: value.postal_code || "",
    lat: value.lat || "",
    lng: value.lng || "",
  });

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

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      const newAddress = {
        fullAddress: place.formatted_address || "",
        country: "",
        city: "",
        state: "",
        postal_code: "",
        lat: place.geometry?.location?.lat() || "",
        lng: place.geometry?.location?.lng() || "",
      };

      place.address_components?.forEach((component) => {
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
      if (onChange) {
        onChange(newAddress);
      }
    }
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <InputComponent
        type="text"
        id="address"
        label="Address"
        placeholder="Country, city, street, zip code"
        value={address.fullAddress || ""}
        onChange={(value) => {
          const updatedAddress = { ...address, fullAddress: value }; // And this line
          setAddress(updatedAddress);
          if (onChange) {
            onChange(updatedAddress);
          }
        }}
      />
    </Autocomplete>
  );
}
