import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useLoading from "../../store/useLoading";
import useModal from "../../store/useModal";
import useCurrentWidth from "../../utils/useCurrentWidth";
import api from "../../utils/api";
import { useEffect, useState } from "react";
import { InputComponent } from "../../components/InputComponent";
import { SelectComponent } from "../../components/SelectComponent";
import useLocations from "../../store/data/useLocations";
import { stringify } from "postcss";

export default function StaffCrud({ action }) {
  const locationParam = useLocation();
  const { onClose, showSuccess, showError } = useModal();
  const { setIsLoading } = useLoading();
  const { isDesktop } = useCurrentWidth();
  const navigate = useNavigate();
  const currentAction = action || locationParam.state?.action;
  const { locations } = useLocations();
  const [originalEmail, setOriginalEmail] = useState("");

  const getStaffById = (id) => {
    setIsLoading(true);
    api
      .get(`/vendor-employee/${id}`)
      .then((response) => {
        const staff = response.data.data;
        setOriginalEmail(staff.email);

        setStaff({
          id: staff.id,
          fullName: staff.fullName,
          email: staff.email,
          location: String(staff.location?.id) 
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [staff, setStaff] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
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
    setStaff((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const saveData = (e) => {
    e.preventDefault();
    let newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
    };

    if (!staff.fullName || staff.fullName.trim() === "") {
      newErrors.fullName = "Full name is required.";
    }
    if (!staff.email || staff.email.trim() === "") {
      newErrors.email = "Email is required.";
    }
    if (currentAction?.type !== "edit") {
      if (!staff.password || staff.password.trim() === "") {
        newErrors.password = "Password is required.";
      }
      if (!staff.confirmPassword || staff.confirmPassword.trim() === "") {
        newErrors.confirmPassword = "Confirm password is required.";
      }
      if (staff.password !== staff.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    if (!staff.location || staff.location.trim() === "") {
      newErrors.location = "Location is required.";
    }
    
    console.log("🚀 ~ saveData ~ newErrors:", newErrors)
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }
    const formData = new FormData();

    formData.append("fullName", staff.fullName);
    formData.append("location", staff.location);
    if (currentAction?.type !== "edit" || staff.email !== originalEmail) {
      formData.append("email", staff.email);
    }
    if (currentAction?.type !== "edit") {
      formData.append("password", staff.password);
    }
    

    setIsLoading(true);
    const apiCall =
      currentAction?.type === "create"
        ? api.post("/vendor-employee", formData)
        : api.put(`/vendor-employee/${staff.id}`, formData);

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
      getStaffById(currentAction.data.id);
    }
  }, [action]);

  return (
    <div className="w-full bg-white px-2 py-8 lg:px-[50px] rounded-2xl">
      <p className="uppercase text-text2Medium lg:text-h3 text-primary2-500 mb-6 text-center">
        {currentAction?.type === "create"
          ? "Create a Responsive Person"
          : "Edit a Responsive Person"}
      </p>

      <form className="w-full flex flex-col gap-5">
        <div className="w-full flex gap-3">
          <InputComponent
            type="text"
            label="Full Name *"
            placeholder="Write Name"
            value={staff.fullName}
            onChange={handleChangeData("fullName")}
            error={errors.fullName}
            className={"w-full"}
          />
          <InputComponent
            type="email"
            label="Email *"
            placeholder="Write Email"
            value={staff.email}
            onChange={handleChangeData("email")}
            error={errors.email}
            className={"w-full"}
          />
        </div>
        <InputComponent
          type="password"
          label="Password *"
          placeholder="Type Password"
          value={staff.password}
          onChange={handleChangeData("password")}
          error={errors.password}
          className={currentAction.type == "edit" && "hidden"}
        />
        <InputComponent
          type="password"
          label="Confirm Password *"
          placeholder="Repeat Password"
          value={staff.confirmPassword}
          onChange={handleChangeData("confirmPassword")}
          error={errors.confirmPassword}
          className={currentAction.type == "edit" && "hidden"}
        />
        <SelectComponent
          id="location"
          label="Attach Location *"
          placeholder={<span className="text-black-200">Select Location</span>}
          value={staff.location}
          onChange={handleChangeData("location")}
          options={locations}
          error={errors.location}
        />
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
