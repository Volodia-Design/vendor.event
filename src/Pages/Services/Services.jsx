import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../../components/Button";
import { SelectComponent } from "../../components/SelectComponent";
import { Pagination } from "swiper/modules";
import { useState } from "react";
import { InputComponent } from "../../components/InputComponent";

export default function Services() {
  const [serviceData, setServiceData] = useState({
    location: "",
    service: "",
    priceRange: "",
    mainSpecification: "",
    mainSpecificationPrice: "",
    specifications: [],
  });
  console.log("🚀 ~ Services ~ serviceData:", serviceData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const locations = [
    { id: 1, name: "New York" },
    { id: 2, name: "London" },
    { id: 3, name: "Paris" },
    { id: 4, name: "Tokyo" },
    { id: 5, name: "Sydney" },
  ];

  const services = [
    { id: 1, name: "Photography" },
    { id: 2, name: "Videography" },
    { id: 3, name: "Wedding Photography" },
    { id: 4, name: "Wedding Videography" },
    { id: 5, name: "Product Photography" },
  ];

  const selects = [
    {
      id: 1,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 2,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 3,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 4,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 5,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 6,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 7,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 8,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 9,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 10,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
  ];

  const chunkedSelects = [];
  for (let i = 0; i < selects.length; i += 6) {
    chunkedSelects.push(selects.slice(i, i + 6));
  }

  const handleDataChange = (index, field, value) => {
    setServiceData((prevData) => {
      // If the field being updated is not in the specifications section
      if (index === undefined) {
        // For main specification and main specification price
        return {
          ...prevData,
          [field]: value,
        };
      } else {
        // For specifications (array of specifications)
        const newSpecifications = [...prevData.specifications];
        newSpecifications[index][field] = value;
        return {
          ...prevData,
          specifications: newSpecifications,
        };
      }
    });
  };

  const handleAddSpecification = () => {
    setServiceData((prevData) => ({
      ...prevData,
      specifications: [
        ...prevData.specifications,
        { specification: "", price: "" },
      ],
    }));
  };

  const handleRemoveSpecification = (index) => {
    setServiceData((prevData) => ({
      ...prevData,
      specifications: prevData.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleCreateService = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-between w-full bg-white p-3 rounded-lg">
        <div className="flex items-center justify-between w-full">
          <p className="text-text3 uppercase">My Services</p>
          <Button
            text="Create a Service"
            buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2"
            onClick={handleCreateService}
          />
        </div>
        {/* Swiper Component */}
        <Swiper
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="w-full !pb-10"
        >
          {chunkedSelects.map((chunk, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {chunk.map((select) => (
                  <div
                    key={select.id}
                    className="flex gap-2 items-center justify-between w-full"
                  >
                    <SelectComponent
                      id={`select-${select.id}`}
                      options={select.options}
                      placeholder="Select a Service"
                      className="w-full"
                      onChange={(value) =>
                        console.log(`Selected value for ${select.id}:`, value)
                      }
                    />
                    <div className="bg-primary2-50 inputSelectStyle w-10 h-10 rounded-full flex items-center justify-center">
                      <img
                        src="/Images/ComponentIcons/Edit.svg"
                        alt="edit"
                        width={24}
                        height={24}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black-900/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-[640px] relative animate-fadeIn shadow-lg"
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
            <p className="uppercase text-h4 text-primary2-500 mb-6 pr-8">
              Create a Service
            </p>

            {/* Form content */}
            <form className="w-full flex flex-col gap-2">
              <SelectComponent
                id="location"
                label="Location *"
                options={locations}
                placeholder="Select Location"
                className="w-full"
                value={serviceData.location || ""}
                onChange={(value) =>
                  handleDataChange(undefined, "location", value)
                }
              />

              <div className="flex items-center gap-4">
                <SelectComponent
                  id="service"
                  options={services}
                  label="Select a Service *"
                  placeholder="Select Type"
                  className="w-full"
                  value={serviceData.service}
                  onChange={(value) =>
                    handleDataChange(undefined, "service", value)
                  }
                />
                <InputComponent
                  id="priceRange"
                  label="Price Range *"
                  placeholder="Enter Price Range"
                  className="w-72"
                  value={serviceData.priceRange}
                  onChange={(value) =>
                    handleDataChange(undefined, "priceRange", value)
                  }
                />
              </div>

              {/* Main Specification Section */}
              <div className="flex items-center gap-4">
                <InputComponent
                  id="mainSpecification"
                  label="Specification"
                  placeholder="Write a specification"
                  className="w-full"
                  value={serviceData.mainSpecification}
                  onChange={(value) =>
                    handleDataChange(undefined, "mainSpecification", value)
                  }
                />
                <div className="w-72 flex items-center gap-2">
                  <InputComponent
                    id="mainSpecificationPrice"
                    label="Price *"
                    placeholder="Write Price"
                    className="w-full"
                    value={serviceData.mainSpecificationPrice}
                    onChange={(value) =>
                      handleDataChange(
                        undefined,
                        "mainSpecificationPrice",
                        value
                      )
                    }
                  />
                  <div>
                    <label className="invisible">a</label>
                    <div
                      onClick={handleAddSpecification}
                      className="flex items-center justify-center w-10 h-10 bg-secondary-800 hover:bg-secondary-700 rounded-lg cursor-pointer"
                    >
                      <span className="text-h4 text-white">+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Specifications Section */}
              {serviceData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-4">
                  <InputComponent
                    id={`specification-${index}`}
                    label="Specification"
                    placeholder="Write a specification"
                    className="w-full"
                    value={spec.specification}
                    onChange={(value) =>
                      handleDataChange(index, "specification", value)
                    }
                  />
                  <div className="w-72 flex items-center gap-2">
                    <InputComponent
                      id={`specificationPrice-${index}`}
                      label="Price *"
                      placeholder="Write Price"
                      className="w-full"
                      value={spec.price}
                      onChange={(value) =>
                        handleDataChange(index, "price", value)
                      }
                    />
                    <div>
                      <label className="invisible">a</label>
                      <div
                        onClick={() => handleRemoveSpecification(index)}
                        className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                      >
                        <span className="text-h4 text-white">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
