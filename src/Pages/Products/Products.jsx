import { useLocation, useNavigate } from "react-router-dom";
import { SelectComponent } from "../../components/SelectComponent";
import Button from "../../components/Button";
import { useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import { InputComponent } from "../../components/InputComponent";
import { MultiSelectComponent } from "../../components/MultiSelectComponent";
import TableComponent from "../../components/TableComponent";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState({
    image: "",
    productName: "",
    stock: "",
    price: "",
    type: "",
    location: "",
    event: "",
    shortDescription: "",
  });

  const locations = [
    { id: 1, name: "New York" },
    { id: 2, name: "London" },
    { id: 3, name: "Paris" },
    { id: 4, name: "Tokyo" },
    { id: 5, name: "Sydney" },
  ];

  const types = [
    { id: 1, name: "Photography" },
    { id: 2, name: "Videography" },
    { id: 3, name: "Wedding Photography" },
    { id: 4, name: "Wedding Videography" },
    { id: 5, name: "Product Photography" },
  ];

  const events = [
    { id: 1, name: "Wedding" },
    { id: 2, name: "Product" },
    { id: 3, name: "Event" },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductData({
      image: "",
      productName: "",
      stock: "",
      price: "",
      type: "",
      location: "",
      event: "",
      shortDescription: "",
    });
    setErrors({
      image: "",
      productName: "",
      stock: "",
      price: "",
      type: "",
      location: "",
      event: "",
      shortDescription: "",
    });
  };

  const handleDataChange = (field, value) => {
    setProductData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleEventChange = (selectedIds) => {
    const eventString = selectedIds.join(", ");
    handleDataChange("event", eventString);
  };

  const [errors, setErrors] = useState({
    image: "",
    productName: "",
    stock: "",
    price: "",
    type: "",
    location: "",
    event: "",
    shortDescription: "",
  });

  const saveData = (e) => {
    e.preventDefault();
    let newErrors = {
      image: "",
      productName: "",
      stock: "",
      price: "",
      type: "",
      location: "",
      event: "",
      shortDescription: "",
    };
    if (!productData.image || productData.image.trim() === "") {
      newErrors.image = "Image is required.";
    }
    if (!productData.productName || productData.productName.trim() === "") {
      newErrors.productName = "Product name is required.";
    }
    if (!productData.stock || productData.stock.trim() === "") {
      newErrors.stock = "Stock is required.";
    }
    if (!productData.price || productData.price.trim() === "") {
      newErrors.price = "Price is required.";
    }
    if (!productData.type || productData.type.trim() === "") {
      newErrors.type = "Type is required.";
    }
    if (!productData.location || productData.location.trim() === "") {
      newErrors.location = "Location is required.";
    }
    if (!productData.event || productData.event.trim() === "") {
      newErrors.event = "Event is required.";
    }
    if (
      !productData.shortDescription ||
      productData.shortDescription.trim() === ""
    ) {
      newErrors.shortDescription = "Short description is required.";
    }
    setErrors(newErrors);
    console.log("🚀 ~ saveData ~ productData:", productData);
  };

  const data = [
    {
      id: 1,
      productName: "Carrot Cake",
      details:
        "Carrots, flour, sugar, butter, eggs, vanilla extract, baking powder, baking soda, cinnamon, nutmeg, salt, walnuts",
      stock: "50",
      price: "1235",
    },
    {
      id: 2,
      productName: "Carrot Cake",
      details:
        "Carrots, flour, sugar, butter, eggs, vanilla extract, baking powder, baking soda, cinnamon, nutmeg, salt, walnuts",
      stock: "14",
      price: "130",
    },
    {
      id: 3,
      productName: "Carrot Cake",
      details:
        "Carrots, flour, sugar, butter, eggs, vanilla extract, baking powder, baking soda, cinnamon, nutmeg, salt, walnuts",
      stock: "35",
      price: "400",
    },
  ];

  const renderCols = () => {
    return (
      <tr className="bg-primary2-50 border border-primary2-50">
        <th className="text-left p-4 text-text4Medium text-primary2-500">Product</th>
        <th className="text-left p-4 text-text4Medium text-primary2-500">Details</th>
        <th className="text-left p-4 text-text4Medium text-primary2-500">Stock</th>
        <th className="text-left p-4 text-text4Medium text-primary2-500">Price</th>
        <th className="text-left p-4 text-text4Medium text-primary2-500">Type</th>
        <th className="text-left p-4 text-text4Medium text-primary2-500">Actions</th>
      </tr>
    );
  };

  const renderRows = () => {
    return data.map((item) => (
      <tr key={item.id} className="border hover:bg-primary2-50/50">
        <td className="p-4 text-gray-700">{item.productName}</td>
        <td className="p-4 text-gray-700 text-sm max-w-md truncate">
          {item.details}
        </td>
        <td className="p-4 text-gray-700">{item.stock}</td>
        <td className="p-4 text-gray-700">USD {item.price}</td>
        <td className="p-4 text-gray-700">Bakery</td>
        <td className="p-4">
         <img
          src="/Images/ComponentIcons/EditColored.svg"
          alt="Edit"
          className="w-6 h-6 cursor-pointer"
          onClick={()=>handleEdit(item)}
        />
        </td>
      </tr>
    ));
  };

  const handleEdit = (item) => {
    console.log("Edit clicked", item);
  }
  return (
    <div className="w-full bg-white py-6 px-8 rounded-lg">
      {/* Navigation */}
      <div className="w-full flex justify-start items-center gap-4 relative text-text2">
        <div
          className={`w-28 text-center cursor-pointer transition-all duration-200 ${
            location.pathname === "/products/product-store"
              ? "text-secondary-700"
              : "text-primary2-500"
          }`}
          onClick={() => navigate("/products/product-store")}
        >
          Product Store
        </div>
        <div
          className={`w-32 text-center cursor-pointer transition-all duration-200 ${
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
              ? "left-0 w-28"
              : "left-32 w-32"
          }`}
        />
      </div>

      {/* Main Content */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-text3 uppercase">
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
        <TableComponent renderCols={renderCols} renderRows={renderRows} />
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
              Create a Product
            </p>

            <form className="mt-4 flex flex-col gap-4">
              {/* Image Upload */}
              <ImageUpload
                setImage={(imageUrl) => handleDataChange("image", imageUrl)}
                error={errors.image}
              />

              {/* Product Name */}
              <InputComponent
                id="productName"
                label="Product Name *"
                placeholder="Write a name of product"
                className="w-full"
                value={productData.productName}
                onChange={(value) => handleDataChange("productName", value)}
                error={errors.productName}
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
                  id="type"
                  label="Type *"
                  placeholder="Select a Type"
                  className="w-full"
                  options={types}
                  value={productData.type}
                  onChange={(value) => handleDataChange("type", value)}
                  error={errors.type}
                />
                <SelectComponent
                  id="location"
                  label="Location *"
                  placeholder="Select a Location"
                  className="w-full"
                  options={locations}
                  value={productData.location}
                  onChange={(value) => handleDataChange("location", value)}
                  error={errors.location}
                />
              </div>

              {/* Event Multi Select */}
              <MultiSelectComponent
                id="event"
                label="Event"
                options={events}
                placeholder="Select an Event"
                className="w-full"
                value={productData.event.split(", ").filter((id) => id !== "")}
                onChange={handleEventChange}
                error={errors.event}
              />

              {/* Short Description */}
              <InputComponent
                id="shortDescription"
                label="Short Description"
                placeholder="Write a short description"
                className="w-full"
                value={productData.shortDescription}
                onChange={(value) =>
                  handleDataChange("shortDescription", value)
                }
                error={errors.shortDescription}
              />

              {/* Modal Actions */}
              <div className="w-full flex gap-3 items-center justify-end mt-2">
                <Button
                  text="Cancel"
                  onClick={handleCloseModal}
                  buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
                />
                <Button
                  text="Create"
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
