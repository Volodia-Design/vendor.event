import { Info } from "lucide-react";
import Button from "../../components/Button";
import { InputComponent } from "../../components/InputComponent";
import { MultiSelectComponent } from "../../components/MultiSelectComponent";
import { SelectComponent } from "../../components/SelectComponent";
import useModal from "../../store/useModal";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import useServiceTypes from "../../store/data/useServiceTypes";
import useLoading from "../../store/useLoading";
import api from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentWidth from "../../utils/useCurrentWidth";
import useLocations from "../../store/data/useLocations";

export default function ServiceCrud({ action, editableService }) {
  const location = useLocation();
  const { onClose, showSuccess, showError } = useModal();
  const { serviceTypes } = useServiceTypes();
  const { setIsLoading } = useLoading();
  const { isDesktop } = useCurrentWidth();
  const { locations } = useLocations();
  const navigate = useNavigate();
  const currentAction = action || location.state?.action;
  const currentService = editableService || location.state?.editableService;
  const type = currentAction?.type || "create";

  const generateDurationOptions = () => {
    const options = [];

    // Add options from 15 min to 60 min in 15 min increments
    for (let minutes = 15; minutes <= 60; minutes += 15) {
      options.push({
        name: minutes === 60 ? "1 hour" : `${minutes} min`,
        id: minutes * 60, // ID is the duration in seconds
      });
    }

    // Add options from 1h 15min to 24 hours in 15 min increments
    for (let minutes = 75; minutes <= 24 * 60; minutes += 15) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const name =
        mins === 0
          ? `${hours} ${hours === 1 ? "hour" : "hours"}`
          : `${hours}h ${mins} min`;

      options.push({
        id: minutes * 60, // Ensure ID is the duration in seconds
        name: name,
      });
    }

    return options;
  };

  const durationOptions = generateDurationOptions();

  const [serviceData, setServiceData] = useState({
    location: [],
    service_type_id: "",
    service_specifications: [
      {
        name: "",
        price: "",
        duration: "", // Added duration field
      },
    ],
  });

  const [errors, setErrors] = useState({
    location: "",
    service_type_id: "",
    service_specifications: [],
  });

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
        { name: "", price: "", duration: "" }, // Added duration
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
    handleDataChange(undefined, "location", selectedIds);
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
  const saveData = (e) => {
    e.preventDefault();
    let newErrors = {
      location: "",
      service_type_id: "",
      service_specifications: [],
    };

    if (!serviceData.location || serviceData.location.length === 0) {
      newErrors.location = "Location is required.";
    }

    if (
      !serviceData.service_type_id ||
      serviceData.service_type_id.trim() === ""
    ) {
      newErrors.service_type_id = "Service type is required.";
    }

    let hasSpecErrors = false;
    const updatedServiceSpecifications = serviceData.service_specifications.map(
      (spec) => {
        let specErrors = {};

        if (!spec.name || spec.name.trim() === "") {
          specErrors.name = "Specification is required.";
          hasSpecErrors = true;
        }

        if (!spec.price || spec.price.trim() === "") {
          specErrors.price = "Price is required.";
          hasSpecErrors = true;
        }

        if (!spec.duration && spec.duration !== 0) {
          specErrors.duration = "Duration is required.";
          hasSpecErrors = true;
        }

        return specErrors;
      }
    );

    newErrors.service_specifications = updatedServiceSpecifications;

    if (newErrors.location || newErrors.service_type_id || hasSpecErrors) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    const dataToSubmit = {
      ...serviceData,
      service_specifications: serviceData.service_specifications.map(
        (spec) => ({
          ...spec,
          duration: Number(spec.duration),
          price: spec.price,
        })
      ),
    };

    setIsLoading(true);
    console.log("🚀 ~ saveData ~ dataToSubmit:", dataToSubmit);

    let apiCall =
      currentAction.type === "create"
        ? api.post("/vendor-service", dataToSubmit)
        : api.put(`/vendor-service/${dataToSubmit.id}`, dataToSubmit);

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
      setServiceData(currentAction.data);
    }
  }, [action, editableService, location.state]);

  console.log("🚀 ~ serviceData:", serviceData.service_specifications);

  return (
    <div className='w-full bg-white px-2 py-8 lg:px-[50px] rounded-2xl'>
      <p className='uppercase text-text2Medium lg:text-h3 text-primary2-500 mb-6 text-center'>
        {currentAction.type === "create"
          ? "Create a Service"
          : "Edit a Service"}
      </p>

      {/* Form content */}
      <form className='w-full flex flex-col gap-5'>
        <MultiSelectComponent
          id='location'
          label='Location *'
          options={locations}
          placeholder='Select Location'
          className='w-full'
          value={serviceData.location.filter((id) => id !== "")}
          onChange={handleLocationChange}
          error={errors.location}
        />
        <div className='flex items-center lg:gap-4 gap-2'>
          <SelectComponent
            id='service_type_id'
            options={serviceTypes}
            label='Select a Service *'
            placeholder={
              <span className='text-black-200  text-text4 lg:text-text3'>
                Select Type
              </span>
            }
            className='w-full'
            value={serviceData.service_type_id}
            onChange={(value) =>
              handleDataChange(undefined, "service_type_id", value)
            }
            error={errors.service_type_id}
          />
          <div className='w-72'>
            <label className='text-text4Medium text-black-400'>
              Price Range *
            </label>
            <div className='flex items-center justify-start pl-3 w-full h-[42px] rounded-lg cursor-pointer inputSelectStyle text-text4 lg:text-text3'>
              <p
                className={`${
                  calculatePriceRange(serviceData.service_specifications)
                    .textColor
                }`}
              >
                {calculatePriceRange(serviceData.service_specifications).value}
              </p>
            </div>
            {errors.service_type_id && (
              <p className='text-red-500 text-text4Medium invisible'>a</p>
            )}
          </div>
        </div>

        {/* Main Service Specification */}
        <div className='w-full flex lg:flex-row flex-col items-start lg:gap-4 gap-2 justify-start'>
          <InputComponent
            id='specification-0'
            label={
              <div className='flex items-center gap-2'>
                <span>Specification</span>
                <Info
                  data-tooltip-id='specificationTooltip'
                  className='w-5 h-5 text-secondary-800 cursor-pointer'
                />
                <Tooltip id='specificationTooltip' place='top' effect='solid'>
                  Use Specifications if your service contains various
                  sub-services
                </Tooltip>
              </div>
            }
            placeholder='Write a specification'
            className='w-full'
            value={serviceData.service_specifications[0]?.name || ""}
            onChange={(value) => handleDataChange(0, "name", value)}
            error={errors.service_specifications?.[0]?.name}
          />
          <div className='w-full flex items-start lg:gap-4 gap-2 justify-start'>
            <InputComponent
              id='specificationPrice-0'
              label='Price *'
              placeholder='Write Price'
              className='lg:w-32 w-full'
              value={serviceData.service_specifications[0]?.price || ""}
              onChange={(value) => handleDataChange(0, "price", Number(value))}
              isPrice={true}
              error={errors.service_specifications?.[0]?.price}
            />
            <SelectComponent
              id='specificationDuration-0'
              label='Duration *'
              options={durationOptions}
              placeholder={
                <span className='text-black-200 text-text4'>
                  Select Duration
                </span>
              }
              withoutLabelMargin={true}
              className='lg:w-40 w-full min-w-40'
              value={serviceData.service_specifications[0]?.duration || ""}
              onChange={(value) => handleDataChange(0, "duration", value)}
              error={errors.service_specifications?.[0]?.duration}
            />
            <div>
              <label className='invisible'>a</label>
              <div
                onClick={handleAddSpecification}
                className='flex items-center justify-center w-10 h-10 bg-secondary-800 hover:bg-secondary-700 rounded-lg cursor-pointer'
              >
                <span className='text-h4 text-white'>+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Specifications */}
        {serviceData.service_specifications.slice(1).map((spec, index) => (
          <div key={index + 1} className='w-full flex lg:flex-row flex-col items-start lg:gap-4 gap-2 justify-start'>
            <InputComponent
              id={`specification-${index + 1}`}
              label='Specification'
              placeholder='Write a specification'
              className='w-full'
              value={spec.name}
              onChange={(value) => handleDataChange(index + 1, "name", value)}
              error={errors.service_specifications?.[index + 1]?.name}
            />
          <div className='w-full flex items-start lg:gap-4 gap-2 justify-start'>
            <InputComponent
              id={`specificationPrice-${index + 1}`}
              label='Price *'
              placeholder='Write Price'
              className='lg:w-32 w-full'
              value={spec.price}
              onChange={(value) =>
                handleDataChange(index + 1, "price", Number(value))
              }
              isPrice={true}
              error={errors.service_specifications?.[index + 1]?.price}
            />
            <SelectComponent
              id={`specificationDuration-${index + 1}`}
              label='Duration *'
              options={durationOptions}
              placeholder={
                <span className='text-black-200 text-text4'>
                  Select Duration
                </span>
              }
              withoutLabelMargin={true}
              className='lg:w-40 w-full min-w-40'
              value={spec.duration || ""}
              onChange={(value) =>
                handleDataChange(index + 1, "duration", value)
              }
              error={errors.service_specifications?.[index + 1]?.duration}
            />
            <div>
              <label className='invisible'>a</label>
              <div
                onClick={() => handleRemoveSpecification(index + 1)}
                className='flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer'
              >
                <span className='text-h4 text-white'>-</span>
              </div>
            </div>
          </div>
          </div>
        ))}

        <div className='w-full flex gap-3 items-center justify-end mt-2'>
          <Button
            text='Cancel'
            onClick={(e) => handleCloseCrud(e)}
            buttonStyles='bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6'
          />
          <Button
            text={currentAction.type === "create" ? "Create" : "Save"}
            onClick={(e) => saveData(e)}
            buttonStyles='bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6'
          />
        </div>
      </form>
    </div>
  );
}
