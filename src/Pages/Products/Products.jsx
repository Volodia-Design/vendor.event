import { useLocation, useNavigate } from "react-router-dom";
import { SelectComponent } from "../../components/SelectComponent";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import { InputComponent } from "../../components/InputComponent";
import { MultiSelectComponent } from "../../components/MultiSelectComponent";
import TableComponent from "../../components/TableComponent";
import useLoading from "../../store/useLoading";
import api from "../../utils/api";
import useServiceTypes from "../../store/data/useServiceTypes";
import useEventTypes from "../../store/data/useEventTypes";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsLoading } = useLoading();
  const { serviceTypes } = useServiceTypes();
  const { eventTypes } = useEventTypes();
  const [isEditMode, setIsEditMode] = useState({
    id: null,
    data: null,
  });
  console.log("🚀 ~ Products ~ isEditMode:", isEditMode);
  const [allProducts, setAllProducts] = useState([]);

  const getProductData = () => {
    setIsLoading(true);
    api
      .get("/vendor-product")
      .then((response) => {
        setAllProducts(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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

  const locations = [
    { id: 1, name: "New York" },
    { id: 2, name: "London" },
    { id: 3, name: "Paris" },
    { id: 4, name: "Tokyo" },
    { id: 5, name: "Sydney" },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductData({
      image: "",
      name: "",
      stock: "",
      price: "",
      service_type_id: "",
      location: "",
      event_types: "",
      description: "",
    });
    setErrors({
      image: "",
      name: "",
      stock: "",
      price: "",
      service_type_id: "",
      location: "",
      event_types: "",
      description: "",
    });
  };

  const handleDataChange = (field, value) => {
    setProductData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleEventChange = (selectedIds) => {
    handleDataChange("event_types", selectedIds);
  };

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
    formDataToSend.append("stock", productData.stock); // Ensure this is numeric or string
    formDataToSend.append("price", productData.price); // Ensure this is numeric or string
    formDataToSend.append("service_type_id", productData.service_type_id);
    formDataToSend.append("location", productData.location);
    formDataToSend.append(
      "event_types",
      JSON.stringify(productData.event_types)
    ); // Convert array to JSON
    formDataToSend.append("description", productData.description);
  
    let apiCall =
      isEditMode.id !== null
        ? api.put(`/vendor-product/${isEditMode.id}`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : api.post("/vendor-product", formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
    apiCall
      .then(() => {
        getProductData();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  const renderCols = () => {
    return (
      <tr className="bg-primary2-50 border border-primary2-50">
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Product
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Details
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Stock
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Price
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Type
        </th>
        <th className="text-center p-4 text-text3Medium text-primary2-500">
          Actions
        </th>
      </tr>
    );
  };

  const renderRows = () => {
    return allProducts.map((item) => (
      <tr key={item.id} className="border hover:bg-primary2-50/50">
        <td className="p-4 text-text3 text-black-300">{item.name}</td>
        <td className="p-4 text-black-300 max-w-md truncate text-text4">
          {item.description}
        </td>
        <td className="p-4 text-text3 text-black-300">{item.stock}</td>
        <td className="p-4 text-text3 text-black-300">USD {item.price}</td>
        <td className="p-4 text-text3 text-black-300">
          {serviceTypes.find((type) => type.id === item.service_type_id)?.name}
        </td>
        <td className="p-4 flex items-center justify-center">
          <img
            src="/Images/ComponentIcons/EditColored.svg"
            alt="Edit"
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleEdit(item)}
          />
        </td>
      </tr>
    ));
  };

  const handleEdit = (item) => {
    setIsEditMode({
      id: item.id,
      data: item,
    });
    setIsModalOpen(true);
    setProductData({
      name: item.name,
      stock: item.stock,
      price: item.price,
      service_type_id: item.service_type_id.toString(),
      location: item.location,
      event_types: item.event_types.map((event) => event.id.toString()),
      description: item.description,
      image: `${api.defaults.baseURL}image/${item.image}`,
    });
  };

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <div className="w-full bg-white py-6 px-8 rounded-lg">
      {/* Navigation */}
      <div className="w-full flex justify-start items-center gap-4 relative text-text2">
        <div
          className={`w-32 text-center cursor-pointer transition-all duration-200 ${
            location.pathname === "/products/product-store"
              ? "text-secondary-700"
              : "text-primary2-500"
          }`}
          onClick={() => navigate("/products/product-store")}
        >
          Product Store
        </div>
        <div
          className={`w-36 text-center cursor-pointer transition-all duration-200 ${
            location.pathname === "/products/order-history"
              ? "text-secondary-700"
              : "text-primary2-500"
          }`}
          onClick={() => navigate("/products/order-history")}
        >
          Orders’ History
        </div>
        <div
          className={`absolute bottom-0 h-[1px] bg-secondary-700 transition-all duration-200 ${
            location.pathname === "/products/product-store"
              ? "left-0 w-32"
              : "left-36 w-36"
          }`}
        />
      </div>

      {/* Main Content */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-text2Medium uppercase">
          {location.pathname === "/products/product-store"
            ? "Products"
            : "Order History"}
        </p>
        <div className="flex items-center gap-3">
          <div className="search-container w-full">
            <input
              type="text"
              placeholder="Search by product"
              className="search-input"
            />
            <button className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="search-icon"
              >
                <path d="M21.71 20.29l-5.4-5.39a8 8 0 10-1.42 1.42l5.4 5.4a1 1 0 001.42-1.42zM10 16a6 6 0 110-12 6 6 0 010 12z" />
              </svg>
            </button>
          </div>

          {/* Select components */}
          <SelectComponent
            withoutLabelMargin={true}
            id="locationSearch"
            options={locations}
            placeholder="All Locations"
            placeholderColor="text-black-200"
            className="w-48"
            value={""}
            onChange={() => {}}
          />
          <Button
            text="Create"
            buttonStyles="bg-secondary-700 text-white hover:bg-secondary-600 px-7"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      {/* Table */}
      <div className="mt-6">
        {location.pathname === "/products/product-store" && (
          <TableComponent renderCols={renderCols} renderRows={renderRows} />
        )}
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black-900/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 px-12 rounded-lg w-[70rem] relative animate-fadeIn shadow-lg  max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal header */}
            <p className="uppercase text-h4 text-primary2-500 mb-6 text-center">
              {isEditMode.id !== null ? "Edit a Product" : "Create a Product"}{" "}
            </p>

            <form className="mt-4 flex flex-col gap-4">
              {/* Image Upload */}
              <ImageUpload
                setImage={(file) =>
                  setProductData((prev) => ({ ...prev, image: file }))
                }
                image={productData.image}
                editMode={!!isEditMode} 
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
                />
              </div>

              {/* Select Type and Location */}
              <div className="flex items-center gap-4">
                <SelectComponent
                  id="service_type_id"
                  label="Type *"
                  placeholder={
                    <span className="text-black-200">Select a Type</span>
                  }
                  className="w-full"
                  options={serviceTypes}
                  value={productData.service_type_id}
                  onChange={(value) =>
                    handleDataChange("service_type_id", value)
                  }
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
                  onClick={handleCloseModal}
                  buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
                />
                <Button
                  text={isEditMode.id !== null ? "Save" : "Create"}
                  onClick={(e) => saveData(e)}
                  buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
