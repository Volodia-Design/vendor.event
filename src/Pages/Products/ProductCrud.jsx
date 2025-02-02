import { useLocation, useNavigate } from "react-router-dom";
import useModal from "../../store/useModal";
import useServiceTypes from "../../store/data/useServiceTypes";
import useLoading from "../../store/useLoading";
import useCurrentWidth from "../../utils/useCurrentWidth";
import useLocations from "../../store/data/useLocations";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ImageUpload from "../../components/ImageUpload";
import { InputComponent } from "../../components/InputComponent";
import { SelectComponent } from "../../components/SelectComponent";
import { MultiSelectComponent } from "../../components/MultiSelectComponent";
import Button from "../../components/Button";
import useEventTypes from "../../store/data/useEventTypes";

export default function ProductCrud({ action }) {
  const location = useLocation();
  const { onClose, showSuccess, showError } = useModal();
  const { serviceTypes } = useServiceTypes();
  const { setIsLoading } = useLoading();
  const { isDesktop } = useCurrentWidth();
  const { locations } = useLocations();
  const { eventTypes } = useEventTypes();
  const navigate = useNavigate();
  const currentAction = action || location.state?.action;
  const type = currentAction?.type || "create";

  const [productData, setProductData] = useState({
    image: "",
    name: "",
    stock: "",
    price: "",
    service_type_id: "",
    location: "",
    event_types: [],
    description: "",
  });
  console.log("🚀 ~ ProductCrud ~ productData:", productData)

  const [errors, setErrors] = useState({
    image: "",
    name: "",
    stock: "",
    price: "",
    service_type_id: "",
    location: "",
    event_types: "",
    description: "",
  });

  const handleDataChange = (field, value) => {
    setProductData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleEventChange = (selectedIds) => {
    handleDataChange("event_types", selectedIds);
  };

  const saveData = (e) => {
    e.preventDefault();
    let newErrors = {
      image: "",
      name: "",
      stock: "",
      price: "",
      service_type_id: "",
      location: "",
      event_types: "",
      description: "",
    };

    if (
      !productData.image ||
      (typeof productData.image === "string" && productData.image.trim() === "")
    ) {
      newErrors.image = "Image is required.";
    }

    if (!productData.name || productData.name.trim() === "") {
      newErrors.name = "Product name is required.";
    }

    if (
      productData.stock === undefined ||
      productData.stock === null ||
      productData.stock === ""
    ) {
      newErrors.stock = "Stock is required.";
    }

    if (
      productData.price === undefined ||
      productData.price === null ||
      productData.price === ""
    ) {
      newErrors.price = "Price is required.";
    }

    if (
      !productData.service_type_id ||
      productData.service_type_id.trim() === ""
    ) {
      newErrors.service_type_id = "Type is required.";
    }

    if (!productData.location || productData.location.trim() === "") {
      newErrors.location = "Location is required.";
    }

    if (!productData.event_types.length) {
      newErrors.event_types = "At least one event type is required.";
    }

    if (!productData.description || productData.description.trim() === "") {
      newErrors.description = "Short description is required.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("file", productData.image);
    formDataToSend.append("name", productData.name);
    formDataToSend.append("stock", productData.stock); 
    formDataToSend.append("price", productData.price); 
    formDataToSend.append("service_type_id", productData.service_type_id);
    formDataToSend.append("location", productData.location);
    formDataToSend.append(
      "event_types",
      JSON.stringify(productData.event_types)
    );
    formDataToSend.append("description", productData.description);

    let apiCall =
      currentAction.type === "create"
        ? api.post("/vendor-product", formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : api.put(`/vendor-product/${currentAction.data.id}`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

    apiCall
      .then(() => {
        showSuccess();
        if (isDesktop) {
          onClose();
        } else {
          navigate(-1);
        }
      })
      .catch(() => {
        showError();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCloseCrud = (e) => {
    e.preventDefault();
    if (isDesktop) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (
      currentAction.type === "edit" &&
      currentAction.data &&
      currentAction.data.id
    ) {
      setProductData(currentAction.data);
    }
  }, [action, location.state]);

  return (
    <div className="w-full bg-white px-2 py-8 lg:px-[50px] rounded-2xl">
      <p className="uppercase text-text2Medium lg:text-h3 text-primary2-500 mb-6 text-center">
        {currentAction.type === "create"
          ? "Create a Product"
          : "Edit a Product"}
      </p>

      {/* Form content */}
      <form className="w-full flex flex-col gap-5">
        {/* Image Upload */}
        <ImageUpload
          setImage={(file) =>
            setProductData((prev) => ({ ...prev, image: file }))
          }
          image={productData.image}
          editMode={!!currentAction.data}
          error={errors.image}
        />

        {/* Product Name */}
        <InputComponent
          id="name"
          label="Product Name *"
          placeholder="Write a name of product"
          className="w-full"
          value={productData.name}
          onChange={(value) => handleDataChange("name", value)}
          error={errors.name}
        />

        {/* Stock and Price */}
        <div className="flex items-center gap-4">
          <InputComponent
            id="stock"
            label="Stock *"
            placeholder="Write a QNT"
            className="w-full"
            value={productData.stock}
            onChange={(value) => handleDataChange("stock", value)}
            error={errors.stock}
            onlyDigits={true}
          />
          <InputComponent
            id="price"
            label="Price *"
            placeholder="Write a price"
            className="w-full"
            value={productData.price}
            onChange={(value) => handleDataChange("price", value)}
            error={errors.price}
            isPrice
          />
        </div>

        {/* Select Type and Location */}
        <div className="flex items-center gap-4">
          <SelectComponent
            id="service_type_id"
            label="Type *"
            placeholder={<span className="text-black-200">Select a Type</span>}
            className="w-full"
            options={serviceTypes}
            value={productData.service_type_id}
            onChange={(value) => handleDataChange("service_type_id", value)}
            error={errors.service_type_id}
          />
          <SelectComponent
            id="location"
            label="Location *"
            placeholder={
              <span className="text-black-200">Select a Location</span>
            }
            className="w-full"
            options={locations}
            value={productData.location}
            onChange={(value) => handleDataChange("location", value)}
            error={errors.location}
          />
        </div>

        {/* Event Multi Select */}
        <MultiSelectComponent
          id="event_types"
          label="Event"
          options={eventTypes}
          placeholder="Select an Event"
          className="w-full"
          value={productData.event_types}
          onChange={handleEventChange}
          error={errors.event_types}
        />

        {/* Short Description */}
        <InputComponent
          id="description"
          label="Short Description"
          placeholder="Write a short description"
          className="w-full"
          value={productData.description}
          onChange={(value) => handleDataChange("description", value)}
          error={errors.description}
        />

        {/* Modal Actions */}
        <div className="w-full flex gap-3 items-center justify-end mt-2">
          <Button
            text="Cancel"
            onClick={(e) => handleCloseCrud(e)}
            buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
          />
          <Button
            text={currentAction.type === "create" ? "Create" : "Save"}
            onClick={(e) => saveData(e)}
            buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
          />
        </div>
      </form>
    </div>
  );
}
