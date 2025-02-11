import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useLoading from "../../store/useLoading";
import useModal from "../../store/useModal";
import useCurrentWidth from "../../utils/useCurrentWidth";
import api from "../../utils/api";
import { useEffect, useState } from "react";
import { InputComponent } from "../../components/InputComponent";
import { MultiSelectComponent } from "../../components/MultiSelectComponent";
import AddressInputComponent from "../../components/AddressInputComponent";
import { SelectComponent } from "../../components/SelectComponent";

export default function LocationCrud({ action }) {
  const locationParam = useLocation();
  const { onClose, showSuccess, showError } = useModal();
  const { setIsLoading } = useLoading();
  const { isDesktop } = useCurrentWidth();
  const navigate = useNavigate();
  const currentAction = action || locationParam.state?.action;

  const [location, setLocation] = useState({
    name: "",
    email: "",
    fullAddress: "",
    phone: "",
    workingDays: [],
    workingHoursFrom: "",
    workingHoursTo: "",
    country: "",
    city: "",
    state: "",
    postal_code: "",
    lat: "",
    lng: "",
  });

  console.log("🚀 ~ LocationCrud ~ location:", location);
  const getLocationById = (id) => {
    setIsLoading(true);
    api
      .get(`/location/${id}`)
      .then((response) => {
        const location = response.data.data;
        setLocation({
          name: location.name,
          email: location.email,
          fullAddress: location.fullAddress,
          phone: location.phone,
          workingDays: location.workingDays
            ? location.workingDays.split(",")
            : [],
          workingHoursFrom: location.workingHoursFrom,
          workingHoursTo: location.workingHoursTo,
          country: location.country,
          city: location.city,
          state: location.state,
          postal_code: location.postal_code,
          lat: location.lat,
          lng: location.lng,
          id: location.id,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let workingDaysOptions = [
    { id: "All week", name: "All week" },
    { id: "Monday", name: "Monday" },
    { id: "Tuesday", name: "Tuesday" },
    { id: "Wednesday", name: "Wednesday" },
    { id: "Thursday", name: "Thursday" },
    { id: "Friday", name: "Friday" },
    { id: "Saturday", name: "Saturday" },
    { id: "Sunday", name: "Sunday" },
  ];

  let startHourOptions = Array.from({ length: 48 }, (_, i) => {
    let hours = String(Math.floor(i / 2)).padStart(2, "0");
    let minutes = i % 2 === 0 ? "00" : "30";
    let time = `${hours}:${minutes}`;
    return { id: time, name: time };
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    fullAddress: "",
    phone: "",
    workingDays: [],
    workingHoursFrom: "",
    workingHoursTo: "",
  });

  const handleChangeData = (field) => (value) => {
    setLocation((prev) => {
      if (field === "workingDays") {
        if (value.includes("All week")) {
          return { ...prev, workingDays: ["All week"] };
        } else {
          return {
            ...prev,
            workingDays: value.filter((day) => day !== "All week"),
          };
        }
      }

      if (field === "workingHoursFrom") {
        return { ...prev, workingHoursFrom: value, workingHoursTo: "" };
      }

      if (field === "workingHoursTo") {
        if (value >= prev.workingHoursFrom) {
          return { ...prev, workingHoursTo: value };
        }
        return prev;
      }

      return { ...prev, [field]: value };
    });
  };
  const handleAddressChange = (newAddress) => {
    setLocation((prev) => ({ ...prev, ...newAddress }));
  };

  const saveData = (e) => {
    e.preventDefault();
    let newErrors = {
      name: "",
      email: "",
      fullAddress: "",
      phone: "",
      workingDays: "",
      workingHoursFrom: "",
      workingHoursTo: "",
    };

    if (!location.name || location.name.trim() === "") {
      newErrors.name = "Name is required.";
    }
    if (
      !location.email ||
      location.email.trim() === "" ||
      !/^\S+@\S+\.\S+$/.test(location.email)
    ) {
      newErrors.email = "Email is required.";
    }
    if (!location.fullAddress || location.fullAddress.trim() === "") {
      newErrors.fullAddress = "Full address is required.";
    }
    if (!location.phone || location.phone.trim() === "") {
      newErrors.phone = "Phone is required.";
    }
    if (!location.workingDays.length) {
      newErrors.workingDays = "Working days is required.";
    }
    if (!location.workingHoursFrom || location.workingHoursFrom.trim() === "") {
      newErrors.workingHoursFrom = "Start hour is required.";
    }
    if (!location.workingHoursTo || location.workingHoursTo.trim() === "") {
      newErrors.workingHoursTo = "End hour is required.";
    }

    setErrors(newErrors);

    console.log(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
    const formData = new FormData();
    formData.append("name", location.name);
    formData.append("email", location.email);
    formData.append("fullAddress", location.fullAddress);
    formData.append("phone", location.phone);
    formData.append("workingDays", location.workingDays.join(","));
    formData.append("workingHoursFrom", location.workingHoursFrom);
    formData.append("workingHoursTo", location.workingHoursTo);

    setIsLoading(true);
    const apiCall =
      currentAction?.type === "create"
        ? api.post("/location", formData)
        : api.put(`/location/${location.id}`, formData);

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
    if (currentAction?.type === "edit") {
      getLocationById(currentAction.data.id);
    }
  }, [action]);

  return (
    <div className="w-full bg-white px-2 py-8 lg:px-[50px] rounded-2xl">
      <p className="uppercase text-text2Medium lg:text-h3 text-primary2-500 mb-6 text-center">
        {currentAction?.type === "create"
          ? "Create a Location"
          : "Edit a Location"}
      </p>

      <form className="w-full flex flex-col gap-5">
        <InputComponent
          type="text"
          label="Location Name *"
          placeholder="Write Name"
          value={location.name}
          onChange={handleChangeData("name")}
          error={errors.name}
        />
        <InputComponent
          type="email"
          label="Email *"
          placeholder="Write Email"
          value={location.email}
          onChange={handleChangeData("email")}
          error={errors.email}
        />
        <AddressInputComponent
          label="Full Address *"
          value={location}
          onChange={handleAddressChange}
          error={errors.fullAddress}
        />
        <InputComponent
          type="text"
          label="Phone Number *"
          placeholder="Write Phone Number"
          value={location.phone}
          onChange={handleChangeData("phone")}
          error={errors.phone}
          isPhoneNumber
        />
        <div className="flex items-start justify-between gap-3">
          <MultiSelectComponent
            label="Working Days *"
            options={workingDaysOptions}
            placeholder="Select days"
            className="w-full"
            value={location.workingDays}
            onChange={handleChangeData("workingDays")}
            error={errors.workingDays}
          />
          <div className="lg:flex gap-3 items-start justify-between w-full hidden">
            <SelectComponent
              label="Start hour *"
              options={startHourOptions}
              value={location.workingHoursFrom}
              onChange={handleChangeData("workingHoursFrom")}
              className="w-full max-w-32"
              placeholder={<span className="text-black-200">09:00</span>}
              error={errors.workingHoursFrom}
            />
            <SelectComponent
              label="End hour *"
              options={
                location.workingHoursFrom
                  ? startHourOptions.filter(
                      (option) => option.id > location.workingHoursFrom
                    )
                  : startHourOptions
              }
              value={location.workingHoursTo}
              onChange={handleChangeData("workingHoursTo")}
              className="w-full max-w-32"
              placeholder={<span className="text-black-200">10:00</span>}
              error={errors.workingHoursTo}
            />
          </div>
        </div>
        <div className="lg:hidden gap-3 items-start justify-between w-full flex">
          <SelectComponent
            label="Start hour *"
            options={startHourOptions}
            value={location.workingHoursFrom}
            onChange={handleChangeData("workingHoursFrom")}
            className="w-full lg:max-w-32"
            placeholder={<span className="text-black-200">09:00</span>}
            error={errors.workingHoursFrom}
          />
          <SelectComponent
            label="End hour *"
            options={
              location.workingHoursFrom
                ? startHourOptions.filter(
                    (option) => option.id > location.workingHoursFrom
                  )
                : startHourOptions
            }
            value={location.workingHoursTo}
            onChange={handleChangeData("workingHoursTo")}
            className="w-full max-w-32"
            placeholder={<span className="text-black-200">10:00</span>}
            error={errors.workingHoursTo}
          />
        </div>
        <div className="w-full flex gap-3 items-center justify-end mt-2">
          <Button
            text="Cancel"
            onClick={handleCloseCrud}
            buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
          />
          <Button
            text={currentAction?.type === "create" ? "Create" : "Save"}
            onClick={saveData}
            buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
          />
        </div>
      </form>
    </div>
  );
}
