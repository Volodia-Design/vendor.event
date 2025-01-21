import { useState } from "react";
import api from "../../utils/api";
import { InputComponent } from "../../components/InputComponent";
import Button from "../../components/Button";

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    position: "",
    fullName: "",
    email: "",
    phoneNumber: "+",
    fullAddress: "",
    socialLinks: [{ link: "" }],
    profileImage: null,
  });
  const [errors, setErrors] = useState({});
  const [modalErrors, setModalErrors] = useState({});
  const [modalData, setModalData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalErrors({});
    setModalData({ newPassword: "", confirmPassword: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSocialLinkChange = (index, value) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { link: value };
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { link: "" }],
    });
  };

  const removeSocialLink = (index) => {
    const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFormData({ ...formData, profileImage: imageURL });
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.position || formData.position.trim() === "") {
      newErrors.position = "Position is required.";
    }
    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Full name is required.";
    }
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required.";
    }
    if (
      !formData.phoneNumber ||
      formData.phoneNumber.trim() === "" ||
      formData.phoneNumber === "+"
    ) {
      newErrors.phoneNumber = "Phone number is required.";
    }
    if (!formData.fullAddress || formData.fullAddress.trim() === "") {
      newErrors.fullAddress = "Full address is required.";
    }
    const socialLinkErrors = formData.socialLinks.map((link, index) => {
      if (link.link.trim() === "") {
        return `Social link #${index + 1} is required.`;
      }
      return null;
    }).filter(error => error !== null); 
  
    if (socialLinkErrors.length > 0) {
      newErrors.socialLinks = socialLinkErrors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    api
      .post("/settings", formData)
      .then((response) => {
        console.log("Settings updated successfully", response);
      })
      .catch((error) => {
        console.error("Error updating settings", error);
      });
  };

  const handleModalSubmit = () => {
    let newErrors = {};

    if (!modalData.newPassword || modalData.newPassword.trim() === "") {
      newErrors.newPassword = "New password is required.";
    }
    if (
      !modalData.confirmPassword ||
      modalData.confirmPassword.trim() === ""
    ) {
      newErrors.confirmPassword = "Confirm password is required.";
    }
    if (modalData.newPassword !== modalData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setModalErrors(newErrors);
      return;
    }

    api
      .post("/change-password", { newPassword })
      .then(() => {
        console.log("Password changed successfully");
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error changing password", error);
      });
  };

  return (
    <div className="w-full bg-white py-6 px-8 rounded-lg flex flex-col items-center gap-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-4"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 rounded-full">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <label
              htmlFor="profileImage"
              className="absolute bottom-1 right-1 bg-secondary-500 text-white p-1 rounded cursor-pointer"
            >
              <img
                src="/Images/ComponentIcons/EditWhite.svg"
                alt="Edit"
                className="w-4 h-4"
              />
            </label>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </div>

        <InputComponent
          id="position"
          label="Position *"
          value={formData.position}
          onChange={(value) =>
            handleInputChange({ target: { name: "position", value } })
          }
          className="w-full"
          placeholder="Write Your Position"
          placeholderColorGray={true}
          error={errors.position}
        />

        <InputComponent
          id="fullName"
          label="Full Name *"
          value={formData.fullName}
          onChange={(value) =>
            handleInputChange({ target: { name: "fullName", value } })
          }
          className="w-full"
          placeholder="Write Your Full Name"
          placeholderColorGray={true}
          error={errors.fullName}
        />

        <InputComponent
          id="email"
          label="Email *"
          value={formData.email}
          onChange={(value) =>
            handleInputChange({ target: { name: "email", value } })
          }
          type="email"
          className="w-full"
          placeholderColorGray={true}
          placeholder="Write Your Email"
          error={errors.email}
        />

        <InputComponent
          id="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(value) =>
            handleInputChange({ target: { name: "phoneNumber", value } })
          }
          className="w-full"
          placeholderColorGray={true}
          placeholder="Write Your Phone Number"
          isPhoneNumber
          error={errors.phoneNumber}
        />

        <InputComponent
          id="fullAddress"
          label="Full Address"
          value={formData.fullAddress}
          onChange={(value) =>
            handleInputChange({ target: { name: "fullAddress", value } })
          }
          className="w-full"
          placeholderColorGray={true}
          placeholder="Write Your Full Address"
          error={errors.fullAddress}
        />

        {formData.socialLinks.map((socialLink, index) => (
          <div key={index} className="flex gap-2 items-center">
            <InputComponent
              id={`socialLink-${index}`}
              label={index === 0 ? "Social Links" : undefined}
              value={socialLink.link}
              onChange={(value) => handleSocialLinkChange(index, value)}
              className="flex-grow"
              placeholderColorGray={true}
              placeholder="Write Your Social Links"
              error={errors.socialLinks?.[index]}
            />
            {index === 0 ? (
              <div
                onClick={addSocialLink}
                className="flex items-center justify-center w-10 h-10 bg-secondary-800 hover:bg-secondary-700 rounded-lg cursor-pointer mt-6"
              >
                <span className="text-h4 text-white">+</span>
              </div>
            ) : (
              <div
                onClick={() => removeSocialLink(index)}
                className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                <span className="text-h4 text-white">-</span>
              </div>
            )}
          </div>
        ))}
        <div
          className="text-secondary-700 flex items-center justify-start text-text4 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Change Password
        </div>
        <div className="flex items-center justify-end">
          <Button
            text="Save"
            onClick={handleSubmit}
            buttonStyles="bg-secondary-700 hover:bg-secondary-600 text-white px-6"
          />
        </div>
      </form>

      {/* Password Change Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black-900/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 px-12 rounded-lg w-[640px] relative animate-fadeIn shadow-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
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

            {/* Modal Header */}
            <p className="uppercase text-h4 text-primary2-500 mb-6 text-center">
              Change Password
            </p>

            {/* Password Inputs */}
            <InputComponent
              id="newPassword"
              label="New Password *"
              value={modalData.newPassword}
              onChange={(value) =>
                handleModalChange({ target: { name: "newPassword", value } })
              }
              type="password"
              className="w-full"
              placeholder="Enter New Password"
              placeholderColorGray={true}
              error={modalErrors.newPassword}
            />

            <InputComponent
              id="confirmPassword"
              label="Confirm Password *"
              value={modalData.confirmPassword}
              onChange={(value) =>
                handleModalChange({
                  target: { name: "confirmPassword", value },
                })
              }
              type="password"
              className="w-full"
              placeholder="Confirm New Password"
              placeholderColorGray={true}
              error={modalErrors.confirmPassword}
            />

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-6">
              <Button
                text="Save"
                onClick={handleModalSubmit}
                buttonStyles="bg-primary2-500 hover:bg-primary2-400 text-white px-6"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
