import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../../components/Button";
import { SelectComponent } from "../../components/SelectComponent";
import { Pagination } from "swiper/modules";
import { useState } from "react";
import { InputComponent } from "../../components/InputComponent";
import { Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { MultiSelectComponent } from "../../components/MultiSelectComponent";

export default function Services() {
  const [serviceData, setServiceData] = useState({
    location: "",
    service_type_id: "",
    service_specifications: [
      {
        name: "",
        price: "",
      },
    ],
  });

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
      if (field === "location" || field === "service_type_id") {
        return {
          ...prevData,
          [field]: value,
        };
      } else {
        const newSpecifications = [...prevData.service_specifications];
        newSpecifications[index] = {
          ...newSpecifications[index],
          [field]: value.toString(), // Ensure value is string
        };
        return {
          ...prevData,
          service_specifications: newSpecifications,
        };
      }
    });
  };

  const handleAddSpecification = () => {
    setServiceData((prevData) => ({
      ...prevData,
      service_specifications: [
        ...prevData.service_specifications,
        { name: "", price: "" },
      ],
    }));
  };

  const handleRemoveSpecification = (index) => {
    setServiceData((prevData) => ({
      ...prevData,
      service_specifications: prevData.service_specifications.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleLocationChange = (selectedIds) => {
    const locationString = selectedIds.join(", ");
    handleDataChange(undefined, "location", locationString);
  };

  const calculatePriceRange = (specifications) => {
    console.log("🚀 ~ calculatePriceRange ~ specifications:", specifications)
    if (!specifications || specifications.length === 0) {
      return "0";
    }
    
    if (specifications.length === 1) {
      return specifications[0].price ? `${specifications[0].price}$` : "0";
    }
  
    const validPrices = specifications
      .map(spec => Number(spec.price))
      .filter(price => !isNaN(price) && price > 0);
  
    if (validPrices.length === 0) return "0";
    
    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);
    
    return `${minPrice}$ - ${maxPrice}$`;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setServiceData({
      location: "",
      service_type_id: "",
      service_specifications: [{ name: "", price: "" }],
    });
  };

  const handleEdit = (service) => {
    console.log("🚀 ~ handleEdit ~ service:", service);
  };
  const saveData = (e) => {
    e.preventDefault(); // Corrected the typo here
    console.log("🚀 ~ saveData ~ serviceData:", serviceData);
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-between w-full bg-white p-3 rounded-lg px-8">
        <div className="flex items-center justify-between w-full">
          <p className="text-text3 uppercase">My Services</p>
          <Button
            text="Create a Service"
            buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2"
            onClick={() => setIsModalOpen(true)}
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
                    <div
                      className="bg-primary2-50 inputSelectStyle w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => handleEdit(select)}
                    >
                      <img
                        src="/Images/ComponentIcons/Edit.svg"
                        alt="edit"
                        width={24}
                        height={24}
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
            <p className="uppercase text-h4 text-primary2-500 mb-6 pr-8 text-center">
              Create a Service
            </p>

            {/* Form content */}
            <form className="w-full flex flex-col gap-2">
              <MultiSelectComponent
                id="location"
                label="Location *"
                options={locations}
                placeholder="Select Location"
                className="w-full"
                value={serviceData.location
                  .split(", ")
                  .filter((id) => id !== "")}
                onChange={handleLocationChange}
              />
             <div className="flex items-center gap-4">
             <SelectComponent
                id="service_type_id"
                options={services}
                label="Select a Service *"
                placeholder="Select Type"
                className="w-full"
                value={serviceData.service_type_id}
                onChange={(value) =>
                  handleDataChange(undefined, "service_type_id", value)
                }
              />
               <div className="w-72">
                    <label>Price Range *</label>
                    <div
                      className="flex items-center justify-start pl-3 w-full h-10 rounded-lg cursor-pointer inputSelectStyle"
                    >
      {calculatePriceRange(serviceData.service_specifications)}
      </div>
                  </div>
             </div>

              {/* Main Service Specification */}
              <div className="flex items-center gap-4">
                <InputComponent
                  id="specification-0"
                  label={
                    <div className="flex items-center gap-2">
                      <span>Specification *</span>
                      <Info
                        data-tooltip-id="specificationTooltip"
                        className="w-5 h-5 text-secondary-800 cursor-pointer"
                      />
                      <Tooltip
                        id="specificationTooltip"
                        place="top"
                        effect="solid"
                      >
                        Use Specifications if your service contains various
                        sub-services
                      </Tooltip>
                    </div>
                  }
                  placeholder="Write a specification"
                  className="w-full"
                  value={serviceData.service_specifications[0]?.name || ""}
                  onChange={(value) => handleDataChange(0, "name", value)}
                />
                <div className="w-72 flex items-center gap-2">
                  <InputComponent
                    id="specificationPrice-0"
                    label="Price *"
                    placeholder="Write Price"
                    className="w-full"
                    value={serviceData.service_specifications[0]?.price || ""}
                    onChange={(value) =>
                      handleDataChange(0, "price", Number(value))
                    }
                    isPrice={true}
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

              {/* Additional Specifications */}
              {serviceData.service_specifications
                .slice(1)
                .map((spec, index) => (
                  <div key={index + 1} className="flex items-center gap-4">
                    <InputComponent
                      id={`specification-${index + 1}`}
                      label="Specification"
                      placeholder="Write a specification"
                      className="w-full"
                      value={spec.name}
                      onChange={(value) =>
                        handleDataChange(index + 1, "name", value)
                      }
                    />
                    <div className="w-72 flex items-center gap-2">
                      <InputComponent
                        id={`specificationPrice-${index + 1}`}
                        label="Price *"
                        placeholder="Write Price"
                        className="w-full"
                        value={spec.price}
                        onChange={(value) =>
                          handleDataChange(index + 1, "price", Number(value))
                        }
                    isPrice={true}

                      />
                      <div>
                        <label className="invisible">a</label>
                        <div
                          onClick={() => handleRemoveSpecification(index + 1)}
                          className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                        >
                          <span className="text-h4 text-white">-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

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
