import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../../components/Button";
import { SelectComponent } from "../../components/SelectComponent";
import { Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { InputComponent } from "../../components/InputComponent";
import { Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { MultiSelectComponent } from "../../components/MultiSelectComponent";
import api from "../../utils/api";
import useServiceTypes from "../../store/data/useServiceTypes";
import useLoading from "../../store/useLoading";

export default function Services() {
  const { setIsLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { serviceTypes } = useServiceTypes();
  const [services, setServices] = useState([]);
  const [transformed, setTransformed] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [isEditMode, setIsEditMode] = useState({
    id: null,
    data: null,
  });
  const locations = [
    { id: 1, name: "New York" },
    { id: 2, name: "London" },
    { id: 3, name: "Paris" },
    { id: 4, name: "Tokyo" },
    { id: 5, name: "Sydney" },
  ];

  const getServices = () => {
    setIsLoading(true);
    api
      .get("/vendor-service")
      .then((response) => {
        const transformedData = response.data.data.map((service) => ({
          ...service,
          service_type_id: String(service.service_type_id),
          service_specifications: service.service_specifications.map(
            (spec) => ({
              ...spec,
              price: String(spec.price),
            })
          ),
        }));
        setServices(transformedData);
        const transformedServices = response.data.data.map((service) => ({
          id: service.id,
          location: service.location,
          serviceName: service.service_type.name,
          priceRange:
            service.service_specifications.length > 0
              ? `${Math.min(
                  ...service.service_specifications.map((spec) =>
                    parseFloat(spec.price)
                  )
                )}$ - 
               ${Math.max(
                 ...service.service_specifications.map((spec) =>
                   parseFloat(spec.price)
                 )
               )}$`
              : "N/A",
          specifications: service.service_specifications.map((spec) => ({
            ...spec,
            price: String(spec.price),
          })),
        }));
        setTransformed(transformedServices);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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

  const formatServiceSpecifications = (service) => {
    return service.service_specifications.map((spec) => ({
      id: `${spec.name}-${spec.price}`,
      name: (
        <div className="flex items-center gap-8 justify-between w-full">
          <span>{spec.name}</span>
          <span>{spec.price}$</span>
        </div>
      ),
    }));
  };

  const chunkedSelects = [];
  for (let i = 0; i < services.length; i += 6) {
    chunkedSelects.push(services.slice(i, i + 6));
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
          [field]: value.toString(),
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
    if (!specifications || specifications.length === 0) {
      return { value: "0", textColor: "text-black-200" };
    }

    if (specifications.length === 1) {
      const price = specifications[0].price ? specifications[0].price : "0";
      return {
        value: `${price}$`,
        textColor: price === "0" ? "text-black-200" : "text-black-900",
      };
    }

    const validPrices = specifications
      .map((spec) => Number(spec.price))
      .filter((price) => !isNaN(price) && price > 0);

    if (validPrices.length === 0)
      return { value: "0", textColor: "text-black-200" };

    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);

    return {
      value: `${minPrice}$ - ${maxPrice}$`,
      textColor: "text-black-900",
    };
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setServiceData({
      location: "",
      service_type_id: "",
      service_specifications: [{ name: "", price: "" }],
    });
    setErrors({
      location: "",
      service_type_id: "",
      service_specifications: [],
    });
  };

  const handleEdit = (service) => {
    setIsEditMode({
      id: service.id,
      data: service,
    });
    setIsModalOpen(true);
    setServiceData({
      location: service.location,
      service_type_id: service.service_type_id.toString(),
      service_specifications: service.service_specifications,
    });
  };

  const [errors, setErrors] = useState({
    location: "",
    service_type_id: "",
    service_specifications: [],
  });

  const saveData = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let newErrors = {
      location: "",
      service_type_id: "",
      service_specifications: [],
    };

    if (!serviceData.location || serviceData.location.trim() === "") {
      newErrors.location = "Location is required.";
    }

    if (
      !serviceData.service_type_id ||
      serviceData.service_type_id.trim() === ""
    ) {
      newErrors.service_type_id = "Service type is required.";
    }

    const updatedServiceSpecifications = serviceData.service_specifications.map(
      (spec, index) => {
        let specErrors = {};

        if (!spec.name || spec.name.trim() === "") {
          specErrors.name = "Specification is required.";
        }

        if (!spec.price || spec.price.trim() === "") {
          specErrors.price = "Price is required.";
        }

        return { ...spec, errors: specErrors };
      }
    );

    newErrors.service_specifications = updatedServiceSpecifications;
    if (
      Object.values(newErrors).some(
        (error) => error !== "" && !Array.isArray(error)
      )
    ) {
      setErrors(newErrors);
      return;
    }

    let apiCall = isEditMode.id
      ? api.put(`/vendor-service/${isEditMode.id}`, serviceData)
      : api.post("/vendor-service", serviceData);

    apiCall
      .then(() => {
        getServices();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-between w-full bg-white p-3 rounded-lg px-8">
        <div className="flex items-center justify-between w-full">
          <p className="text-text2Medium uppercase">My Services</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {chunk.map((service) => {
                  const transformedService = transformed.find(
                    (t) => t.id === service.id
                  );
                  return (
                    <div
                      key={service.id}
                      className="flex gap-2 items-center justify-between w-full"
                    >
                      <SelectComponent
                        id={`select-${service.id}`}
                        placeholder={
                          <div className="flex justify-between w-full">
                            <span>{transformedService?.serviceName}</span>
                            <span>{transformedService?.priceRange}</span>
                          </div>
                        }
                        options={
                          transformedService
                            ? transformedService.specifications.map((spec) => ({
                                id: `${spec.id}`,
                                name: (
                                  <div className="flex justify-between w-full">
                                    <span>{spec.name}</span>
                                    <span>{spec.price}$</span>
                                  </div>
                                ),
                              }))
                            : []
                        }
                        className="w-full"
                        value={selectedServices[service.id] || ""}
                        onChange={(value) => {
                          setSelectedServices((prev) => ({
                            ...prev,
                            [service.id]: value,
                          }));
                        }}
                      />
                      <div
                        className="bg-primary2-50 inputSelectStyle w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => handleEdit(service)}
                      >
                        <img
                          src="/Images/ComponentIcons/Edit.svg"
                          alt="edit"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  );
                })}
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
              {isEditMode.id ? "Edit a Service" : "Create a Service"}
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
                error={errors.location}
              />
              <div className="flex items-center gap-4">
                <SelectComponent
                  id="service_type_id"
                  options={serviceTypes}
                  label="Select a Service *"
                  placeholder={
                    <span className="text-black-200">Select Type</span>
                  }
                  className="w-full"
                  value={serviceData.service_type_id}
                  onChange={(value) =>
                    handleDataChange(undefined, "service_type_id", value)
                  }
                  error={errors.service_type_id}
                />
                <div className="w-72">
                  <label className="text-text4Medium text-black-400">
                    Price Range *
                  </label>
                  <div className="flex items-center justify-start pl-3 w-full h-10 rounded-lg cursor-pointer inputSelectStyle">
                    <p
                      className={`${
                        calculatePriceRange(serviceData.service_specifications)
                          .textColor
                      }`}
                    >
                      {
                        calculatePriceRange(serviceData.service_specifications)
                          .value
                      }
                    </p>
                  </div>
                  {errors.service_type_id && (
                    <p className="text-red-500 text-text4Medium invisible">a</p>
                  )}
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
                  error={errors.service_specifications?.[0]?.name}
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
                    error={errors.service_specifications?.[0]?.price}
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
                      error={errors.service_specifications?.[index + 1]?.name}
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
                        error={
                          errors.service_specifications?.[index + 1]?.price
                        }
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
                  text={isEditMode?.id ? "Save" : "Create"}
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
