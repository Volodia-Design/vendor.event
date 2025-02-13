import { useEffect, useState } from "react";
import api from "../../utils/api";
import { InputComponent } from "../../components/InputComponent";
import Button from "../../components/Button";
import ImageUpload from "../../components/ImageUpload";
import useLoading from "../../store/useLoading";
import useModal from "../../store/useModal";
import AddressInputComponent from "../../components/AddressInputComponent";

export default function Settings() {
  const { setIsLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [temporaryImage, setTemporaryImage] = useState(null);
  const { showSuccess, showError } = useModal();

  const [formData, setFormData] = useState({
    position: "",
    fullName: "",
    email: "",
    phone: "+",
    fullAddress: "",
    socialLinks: [{ url: "", image: null, imagePreview: "" }],
    profileImage: null,
  });
  const getUserData = async () => {
    try {
      setIsLoading(true);
      const userResponse = await api.get("/auth/self");
      const { vendor, fullName, email, phone, image } = userResponse.data.data;

      const socialsResponse = await api.get("/social");
      const socials = socialsResponse.data.data.data;

      const formattedSocials =
        socials.length > 0
          ? socials.map((social) => ({
              id: social.id, // Make sure to preserve the ID
              url: social.url || "",
              image: null,
              imagePreview: social.image
                ? `${api.defaults.baseURL}image/${social.image}`
                : "",
            }))
          : [{ url: "", image: null, imagePreview: "" }];

      setFormData({
        position: vendor?.position || "",
        fullName: fullName || "",
        email: email || "",
        phone: phone || "",
        fullAddress: vendor?.address || "",
        socialLinks: formattedSocials,
        profileImage: null,
        profileImagePreview: image
          ? `${api.defaults.baseURL}image/${image}`
          : null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [errors, setErrors] = useState({});
  const [modalErrors, setModalErrors] = useState({});
  const [modalData, setModalData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsImageModalOpen(false);
    setModalErrors({});
    setModalData({ newPassword: "", confirmPassword: "" });
  };

  const handleImageModalClose = () => {
    if (temporaryImage) {
      URL.revokeObjectURL(temporaryImage);
    }
    setTemporaryImage(null);
    setIsImageModalOpen(false);
  };

  const saveImageToFormData = () => {
    if (temporaryImage) {
      setFormData({
        ...formData,
        profileImage: temporaryImage,
        profileImagePreview: URL.createObjectURL(temporaryImage),
      });
    }
    handleImageModalClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAddressChange = (newAddress) => {
    setFormData((prev) => ({ ...prev, ...newAddress }));
  };
  const handleSocialLinkChange = (index, value) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = {
      ...updatedLinks[index], // Preserve existing properties including image
      url: value, // Only update the URL
    };
    setFormData({ ...formData, socialLinks: updatedLinks });
  };
  const handleIconUpload = (index, file) => {
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      const updatedLinks = [...formData.socialLinks];
      updatedLinks[index] = {
        ...updatedLinks[index],
        image: file,
        imagePreview: imagePreview,
      };
      setFormData({ ...formData, socialLinks: updatedLinks });
    }
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [
        ...formData.socialLinks,
        { url: "", image: null, imagePreview: "" },
      ],
    });
  };

  const removeSocialLink = (id) => {
    setIsLoading(true);
    api
      .delete(`/social/${id}`)
      .then((response) => {
        showSuccess();
        getUserData();
      })
      .catch((error) => {
        showError();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Basic validations
    if (!formData.fullName?.trim())
      newErrors.fullName = "Full name is required.";
    if (!formData.email?.trim()) newErrors.email = "Email is required.";
    if (!formData.phone?.trim() || formData.phone === "+")
      newErrors.phone = "Phone number is required.";

    // Validate social links
    formData.socialLinks.forEach((link, index) => {
      if (link.url.trim() !== "" && !isValidUrl(link.url)) {
        if (!newErrors.socialLinks) newErrors.socialLinks = {};
        newErrors.socialLinks[index] = "Invalid URL format.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Handle user profile update
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      if (formData.profileImage) {
        formDataToSend.append("file", formData.profileImage);
      }

      const vendorData = {
        position: formData.position,
        address: formData.fullAddress,
      };

      formDataToSend.append("vendor", JSON.stringify(vendorData));

      // Update user profile
      await api.put("/auth/self", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle social links
      const socialsResponse = await api.get("/social");
      const existingSocials = socialsResponse.data.data.data;

      // Filter valid social links
      const validSocialLinks = formData.socialLinks.filter((link) => {
        if (link.id) {
          return link.url.trim() !== "";
        } else {
          return link.url.trim() !== "" && link.image instanceof File;
        }
      });

      for (const socialLink of validSocialLinks) {
        const socialFormData = new FormData();
        socialFormData.append("url", socialLink.url);

        if (socialLink.image instanceof File) {
          socialFormData.append("file", socialLink.image);
        }

        if (socialLink.id) {
          await api.put(`/social/${socialLink.id}`, socialFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          await api.post("/social", socialFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      }

      for (const existingSocial of existingSocials) {
        const stillExists = validSocialLinks.some(
          (link) => link.id === existingSocial.id
        );
        if (!stillExists) {
          await api.delete(`/social/${existingSocial.id}`);
        }
      }

      setErrors({});
      showSuccess();
      getUserData();
    } catch (error) {
      console.error("Error updating settings:", error);
      showError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!modalData.oldPassword || modalData.oldPassword.trim() === "") {
      newErrors.oldPassword = "Old password is required.";
    }

    if (!modalData.newPassword || modalData.newPassword.trim() === "") {
      newErrors.newPassword = "New password is required.";
    }
    if (!modalData.confirmPassword || modalData.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm password is required.";
    }
    if (modalData.newPassword !== modalData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setModalErrors(newErrors);
      return;
    }
    const formDataToSend = new FormData();

    formDataToSend.append("password", modalData.confirmPassword);
    formDataToSend.append("phone", formData.phone);

    setIsLoading(true);
    api
      .put("/auth/self", formDataToSend)
      .then(() => {
        handleCloseModal();
        showSuccess();
      })
      .catch(() => {
        newErrors.confirmPassword = "Failed to change password.";
        setModalErrors(newErrors);
        showError();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="w-full bg-white py-6 px-8 rounded-lg flex flex-col items-center gap-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-4"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 rounded-full">
            {formData.profileImagePreview ? (
              <img
                src={formData.profileImagePreview}
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
              onClick={() => setIsImageModalOpen(true)} // Open the image modal on click
            >
              <img
                src="/Images/ComponentIcons/EditWhite.svg"
                alt="Edit"
                className="w-4 h-4"
              />
            </label>
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
          id="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={(value) =>
            handleInputChange({ target: { name: "phone", value } })
          }
          className="w-full"
          placeholderColorGray={true}
          placeholder="Write Your Phone Number"
          isPhoneNumber
          error={errors.phone}
        />
        <AddressInputComponent
          label="Full Address *"
          value={formData}
          onChange={handleAddressChange}
          error={errors.fullAddress}
        />
        {formData.socialLinks.map((socialLink, index) => (
          <div key={index} className="flex items-center justify-center gap-3">
            {/* Social Link Input */}
            <InputComponent
              type="url"
              id={`socialLink-${index}`}
              label={index === 0 ? "Social Links" : undefined}
              value={socialLink.url}
              onChange={(value) => handleSocialLinkChange(index, value)}
              className="flex-grow"
              placeholderColorGray={true}
              placeholder="Enter social link"
              error={errors.socialLinks?.[index]}
            />
            {/* File Input for Icon */}
            <div className={`relative w-12 h-12 ${index === 0 ? "mt-6" : ""}`}>
              {socialLink.imagePreview ? (
                <img
                  src={socialLink.imagePreview}
                  alt="Social Icon"
                  className="w-12 h-12 object-cover rounded-full border"
                />
              ) : (
                <img
                  src="/NoImage.webp"
                  alt="Social Icon"
                  className="w-12 h-12 object-cover rounded-full border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleIconUpload(index, e.target.files[0])}
              />
            </div>

            {/* Add / Remove Buttons */}
            {index === 0 ? (
              <div
                onClick={addSocialLink}
                className="flex items-center justify-center w-10 h-10 bg-secondary-800 hover:bg-secondary-700 rounded-lg cursor-pointer mt-6"
              >
                <span className="text-h4 text-white">+</span>
              </div>
            ) : (
              <div
                onClick={() => removeSocialLink(socialLink.id)}
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
            <form className="w-full flex flex-col gap-2">
              <InputComponent
                id="oldPassword"
                label="Old Password *"
                value={modalData.oldPassword}
                onChange={(value) =>
                  handleModalChange({ target: { name: "oldPassword", value } })
                }
                type="password"
                className="w-full"
                placeholder="Write your old password"
                placeholderColorGray={true}
                error={modalErrors.oldPassword}
              />

              <InputComponent
                id="newPassword"
                label="New Password *"
                value={modalData.newPassword}
                onChange={(value) =>
                  handleModalChange({ target: { name: "newPassword", value } })
                }
                type="password"
                className="w-full"
                placeholder="Write new password"
                placeholderColorGray={true}
                error={modalErrors.newPassword}
              />
              <span className="text-text4 text-gray-400 -mt-2">
                * Your password must contain 8 characters include at least one
                capital letter, at least one small letter, at least one special
                symbol.
              </span>

              <InputComponent
                id="confirmPassword"
                label="Confirm New Password *"
                value={modalData.confirmPassword}
                onChange={(value) =>
                  handleModalChange({
                    target: { name: "confirmPassword", value },
                  })
                }
                type="password"
                className="w-full"
                placeholder="Repeat new password"
                placeholderColorGray={true}
                error={modalErrors.confirmPassword}
              />

              {/* Submit Button */}
              <div className="flex items-center justify-end mt-6 gap-3">
                <Button
                  text="Cancel"
                  onClick={handleCloseModal}
                  buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
                />
                <Button
                  text="Save"
                  onClick={(e) => handleModalSubmit(e)}
                  buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black-900/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={handleImageModalClose}
        >
          <div
            className="bg-white p-6 px-12 rounded-lg w-[640px] relative animate-fadeIn shadow-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleImageModalClose}
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
            <p className="uppercase text-h4 text-primary2-500 mb-6 text-center">
              Upload Profile Image
            </p>
            <ImageUpload
              setImage={(file) => setTemporaryImage(file)}
              error={null}
              image={temporaryImage}
              editMode={true}
            />
            <div className="flex items-center justify-end mt-6 gap-3">
              <Button
                text="Cancel"
                onClick={handleImageModalClose}
                buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
              />
              <Button
                text="Save"
                onClick={saveImageToFormData}
                buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
