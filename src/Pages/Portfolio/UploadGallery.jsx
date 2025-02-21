import { useState, useRef } from "react";
import { SelectComponent } from "../../components/SelectComponent";
import useServiceTypes from "../../store/data/useServiceTypes";
import Button from "../../components/Button";
import useCurrentWidth from "../../utils/useCurrentWidth";
import useModal from "../../store/useModal";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import useLoading from "../../store/useLoading";

export default function UploadGallery({ action }) {
  const currentAction = action || location.state?.action;
  const { serviceTypes } = useServiceTypes();
  const { isDesktop } = useCurrentWidth();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const { onClose, showSuccess, showError } = useModal();

  const [mediaData, setMediaData] = useState({
    serviceTypeId: "",
    files: [],
    thumbnail: null,
  });
  console.log("🚀 ~ UploadGallery ~ mediaData:", mediaData)
  const [errors, setErrors] = useState({
    serviceTypeId: "",
  });

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleDataChange = (field, value) => {
    setMediaData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setMediaData((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...files],
    }));
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaData((prevData) => ({
        ...prevData,
        thumbnail: file,
      }));
    }
  };

  const removeFile = (index) => {
    setMediaData((prevData) => ({
      ...prevData,
      files: prevData.files.filter((_, i) => i !== index),
    }));
  };

  const removeThumbnail = () => {
    setMediaData((prevData) => ({
      ...prevData,
      thumbnail: null,
    }));
  };

  const handleCloseCrud = (e) => {
    e.preventDefault();
    if (isDesktop) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const saveData = async (e) => {
    e.preventDefault();
    
    if (!mediaData.serviceTypeId) {
      setErrors({ serviceTypeId: "Please select a category" });
      return;
    }
  setIsLoading(true);
    try {
      const uploadedFileIds = [];
  
      for (const file of mediaData.files) {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await api.post("/file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        uploadedFileIds.push(response.data.data.id); 
        
      }
  
      let thumbnailId = null;
  
      if (mediaData.thumbnail) {
        const formData = new FormData();
        formData.append("file", mediaData.thumbnail);
  
        const response = await api.post("/file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        thumbnailId = response.data.data.id;
      }
  
      await api.post("/gallery", {
        serviceTypeId: mediaData.serviceTypeId,
        files: uploadedFileIds,
        thumbnail: thumbnailId,
      });
  
      showSuccess("Gallery uploaded successfully!");
      onClose();
    } catch (error) {
      showError("Failed to upload gallery. Please try again.");
      console.error("Upload error:", error);
    }
    setIsLoading(false);
  };
  

  return (
    <div className="w-full bg-white px-2 py-8 lg:px-[50px] rounded-2xl">
      <p className="uppercase text-text2Medium lg:text-h3 text-primary2-500 mb-6 text-center">
        {currentAction?.type === "create" ? "Upload Media" : "Edit a Service"}
      </p>
      <div className="w-full flex flex-col items-center gap-4">
        <SelectComponent
          id="serviceTypeId"
          options={serviceTypes}
          label="Select a Category *"
          placeholder={
            <span className="text-black-200 text-text4 lg:text-text3">
              Select category
            </span>
          }
          className="w-full"
          value={mediaData.serviceTypeId}
          onChange={(value) => handleDataChange("serviceTypeId", value)}
          error={errors.serviceTypeId}
        />
      </div>
      <div className="flex gap-3 mt-4 flex-col items-start">
        <div
          className="flex gap-2 items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-text3Medium text-sec2-500">Upload Files</p>
          <img
            src="/Images/ComponentIcons/UploadFile.svg"
            className="w-8 h-8"
            alt=""
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {mediaData.files.map((file, index) => (
            <div key={index} className="relative w-24 h-24 border p-1">
              {file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full h-full object-cover rounded"
                />
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div
          className="flex gap-2 items-center justify-center cursor-pointer"
          onClick={() => thumbnailInputRef.current.click()}
        >
          <p className="text-text3Medium text-sec2-500">Upload Thumbnail</p>
          <img
            src="/Images/ComponentIcons/UploadFile.svg"
            className="w-8 h-8"
            alt=""
          />
        </div>
        <input
          type="file"
          ref={thumbnailInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailUpload}
        />
        {mediaData.thumbnail && (
          <div className="relative w-24 h-24 border p-1 mt-2">
            <img
              src={URL.createObjectURL(mediaData.thumbnail)}
              alt="Thumbnail preview"
              className="w-full h-full object-cover rounded"
            />
            <button
              onClick={removeThumbnail}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
            >
              X
            </button>
          </div>
        )}
      </div>
      <div className="w-full flex gap-3 items-center justify-end mt-2">
        <Button
          text="Cancel"
          onClick={(e) => handleCloseCrud(e)}
          buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
        />
        <Button
          text={currentAction.type === "create" ? "Create" : "Save"}
          onClick={(e) => saveData(e)}
          buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
        />
      </div>
    </div>
  );
}
