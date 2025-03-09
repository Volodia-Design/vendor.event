import { useState, useRef, useEffect } from "react";
import { SelectComponent } from "../../components/SelectComponent";
import Button from "../../components/Button";
import useCurrentWidth from "../../utils/useCurrentWidth";
import useModal from "../../store/useModal";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import useLoading from "../../store/useLoading";

// New warning modal component
function UploadWarningModal({ onCancel, onContinue }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-h4 text-primary2-500 mb-3">Upload in Progress</h3>
        <p className="text-text3Medium mb-4">
          You have an upload in progress. If you leave now, your upload will be cancelled.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            text="Stay"
            onClick={onCancel}
            buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
          />
          <Button
            text="Leave Anyway"
            onClick={onContinue}
            buttonStyles="bg-red-600 hover:bg-red-700 text-white py-2 px-6"
          />
        </div>
      </div>
    </div>
  );
}

export default function UploadGallery({ action }) {
  const location = useLocation();
  const currentAction = action || location.state?.action;
  const { isDesktop } = useCurrentWidth();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const { onClose: originalOnClose, showSuccess, showError } = useModal();

  const [mediaData, setMediaData] = useState({
    serviceTypeId: "",
    files: [],
    thumbnail: null,
  });

  const [errors, setErrors] = useState({
    serviceTypeId: "",
  });

  // Upload progress tracking
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    total: 0,
    completed: 0,
    currentFileName: "",
    percentComplete: 0,
  });

  // For cancellation
  const cancelUploadRef = useRef(false);
  const abortControllerRef = useRef(null);

  // For showing custom warning modal
  const [showWarningModal, setShowWarningModal] = useState(false);
  const pendingCloseActionRef = useRef(null);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Create a ref to track if we're allowed to close the modal
  const canCloseRef = useRef(false);

  // This effect overrides the modal's onClose function to protect against uploads in progress
  useEffect(() => {
    const originalOnCloseFn = useModal.getState().onClose;

    const protectedOnClose = () => {
      if (isUploading && !canCloseRef.current) {
        setShowWarningModal(true);
        pendingCloseActionRef.current = () => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          cancelUploadRef.current = true;
          originalOnCloseFn();
        };
      } else {
        originalOnCloseFn();
      }
    };

    useModal.setState({ onClose: protectedOnClose });

    return () => {
      useModal.setState({ onClose: originalOnCloseFn });
    };
  }, [isUploading]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isUploading) {
        e.preventDefault();
        e.returnValue =
          "You have an upload in progress. If you leave now, your upload will be cancelled.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUploading]);

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
    useModal.getState().onClose();
  };

  const uploadFile = async (file, isDriveUpload = false) => {
    if (cancelUploadRef.current) {
      throw new Error("Upload cancelled by user");
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setUploadProgress((prev) => ({
        ...prev,
        currentFileName: file.name,
      }));
  
      abortControllerRef.current = new AbortController();
  
      let response;
      if (currentAction?.driveUploadId) {
        response = await api.put(`/content/${currentAction?.driveUploadId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          signal: abortControllerRef.current.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              percentComplete: percentCompleted,
            }));
          },
        });
      }else {
        response = await api.post("/file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          signal: abortControllerRef.current.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              percentComplete: percentCompleted,
            }));
          },
        });
      }
  
      setUploadProgress((prev) => ({
        ...prev,
        completed: prev.completed + 1,
        percentComplete: 0,
      }));
  
      return response.data.data.id;
    } catch (error) {
      if (
        error.name === "AbortError" ||
        error.message === "Upload cancelled by user"
      ) {
        console.log(`Upload of ${file.name} was cancelled`);
        throw new Error("Upload cancelled by user");
      }
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  };
  

  const saveData = async (e) => {
    e.preventDefault();
  
    if (!mediaData.serviceTypeId && currentAction?.galleryUpload) {
      setErrors({ serviceTypeId: "Please select service" });
      return;
    }
  
    const totalFiles = currentAction?.driveUpload
      ? mediaData.files.length
      : mediaData.files.length + (mediaData.thumbnail ? 1 : 0);
  
    if (totalFiles === 0) {
      showError("Please select at least one file to upload");
      return;
    }
  
    setIsUploading(true);
    cancelUploadRef.current = false;
  
    setUploadProgress({
      total: totalFiles,
      completed: 0,
      currentFileName: "",
      percentComplete: 0,
    });
  
    try {
      const uploadedFileIds = [];
  
      if (currentAction?.galleryUpload) {
        // Handling gallery upload
        for (const file of mediaData.files) {
          if (cancelUploadRef.current) break;
  
          const fileId = await uploadFile(file); // Upload file for gallery
          uploadedFileIds.push(fileId);
        }
  
        if (cancelUploadRef.current) {
          throw new Error("Upload cancelled by user");
        }
  
        let thumbnailId = null;
        if (mediaData.thumbnail) {
          thumbnailId = await uploadFile(mediaData.thumbnail); // Upload thumbnail
        }
  
        if (cancelUploadRef.current) {
          throw new Error("Upload cancelled by user");
        }
  
        await api.post("/gallery", {
          serviceTypeId: mediaData.serviceTypeId,
          files: uploadedFileIds,
          thumbnail: thumbnailId,
        });
      }
  
      if (currentAction?.driveUpload) {
        const totalFiles = mediaData.files.length;  // Get the total number of files before upload
        setUploadProgress({
          total: totalFiles,
          completed: 0,
          currentFileName: '',
          percentComplete: 0,
        });
      
        for (const file of mediaData.files) {
          if (cancelUploadRef.current) break;
          const fileId = await uploadFile(file); // This is for gallery upload
          uploadedFileIds.push(fileId);
          // Update progress after each file upload
          setUploadProgress((prev) => {
            const newCompleted = uploadedFileIds.length + 1;
            const newPercentComplete = Math.round((newCompleted / totalFiles) * 100);
            return {
              ...prev,
              completed: newCompleted,
              currentFileName: file.name,
              percentComplete: newPercentComplete,
            };
          });
        }
      }
      
  
      setIsUploading(false);
      canCloseRef.current = true;
      showSuccess("Files uploaded successfully!");
      useModal.getState().onClose();
    } catch (error) {
      if (error.message === "Upload cancelled by user") {
        console.log("Upload was cancelled by user");
      } else {
        showError("Failed to upload files. Please try again.");
        console.error("Upload error:", error);
      }
    } finally {
      setIsUploading(false);
      setIsLoading(false);
      if (!isDesktop) {
        navigate(-1);
      }
    }
  };
  


  const handleStayOnPage = () => {
    setShowWarningModal(false);
  };

  const handleLeavePage = () => {
    setShowWarningModal(false);
    if (pendingCloseActionRef.current) {
      pendingCloseActionRef.current();
    }
  };

  return (
    <div className='w-full bg-white px-2 py-8 lg:px-[50px] rounded-2xl'>
      {showWarningModal && (
        <UploadWarningModal
          onCancel={handleStayOnPage}
          onContinue={handleLeavePage}
        />
      )}

      <p className='uppercase text-text2Medium lg:text-h3 text-primary2-500 mb-6 text-center'>
        {currentAction?.type === "create" ? "Upload Media" : "Edit a Service"}
      </p>

      {isUploading && (
        <div className='mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50'>
          {/* Show upload progress */}
          <p className='text-text3Medium mb-2'>
            Uploading {uploadProgress.completed} of {uploadProgress.total} files
          </p>
          {uploadProgress.currentFileName && (
            <p className='text-text4 text-gray-500 mb-1'>
              Current file: {uploadProgress.currentFileName}
            </p>
          )}
          <div className='w-full bg-gray-200 rounded-full h-2.5'>
            <div
              className='bg-primary2-500 h-2.5 rounded-full transition-all duration-300'
              style={{ width: `${uploadProgress.percentComplete}%` }}
            ></div>
          </div>
          <p className='text-text4 text-gray-500 mt-1 text-right'>
            {uploadProgress.percentComplete}%
          </p>

          {/* Add cancel button */}
          <div className='mt-3 flex justify-end'>
            <Button
              text='Cancel Upload'
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to cancel the upload?")
                ) {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                  }
                  cancelUploadRef.current = true;
                  setIsUploading(false);
                }
              }}
              buttonStyles='bg-white border border-red-500 text-red-500 hover:bg-red-50 py-1 px-3 text-sm'
            />
          </div>
        </div>
      )}

      <div className='w-full flex flex-col items-center gap-4'>
        {/* Conditionally render the select and thumbnail upload based on action */}
        {currentAction?.galleryUpload && !isUploading && (
          <>
            <SelectComponent
              id='serviceTypeId'
              options={currentAction?.services}
              label='Select Service *'
              placeholder={
                <span className='text-black-200 text-text4 lg:text-text3'>
                  Select Service
                </span>
              }
              className='w-full'
              value={mediaData.serviceTypeId}
              onChange={(value) => handleDataChange("serviceTypeId", value)}
              error={errors.serviceTypeId}
              disabled={isUploading}
            />
            <div className='flex gap-3 mt-4 flex-col items-start w-full'>
              <div
                className={`flex gap-2 items-center justify-center ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => !isUploading && fileInputRef.current.click()}
              >
                <p className='text-text3Medium text-sec2-500'>Upload Files</p>
                <img
                  src='/Images/ComponentIcons/UploadFile.svg'
                  className='w-8 h-8'
                  alt=''
                />
              </div>
              <input
                type='file'
                ref={fileInputRef}
                multiple
                accept='image/*,video/*'
                className='hidden'
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {mediaData.files.map((file, index) => (
                  <div key={index} className='relative w-24 h-24 border p-1'>
                    {file.type.startsWith("image") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt='preview'
                        className='w-full h-full object-cover rounded'
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        className='w-full h-full object-cover rounded'
                      />
                    )}
                    <button
                      onClick={() => !isUploading && removeFile(index)}
                      className={`absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isUploading}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div
                className={`flex gap-2 items-center justify-center ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() =>
                  !isUploading && thumbnailInputRef.current.click()
                }
              >
                <p className='text-text3Medium text-sec2-500'>
                  Upload Thumbnail
                </p>
                <img
                  src='/Images/ComponentIcons/UploadFile.svg'
                  className='w-8 h-8'
                  alt=''
                />
              </div>
              <input
                type='file'
                ref={thumbnailInputRef}
                accept='image/*'
                className='hidden'
                onChange={handleThumbnailUpload}
                disabled={isUploading}
              />
              {mediaData.thumbnail && (
                <div className='relative w-24 h-24 border p-1 mt-2'>
                  <img
                    src={URL.createObjectURL(mediaData.thumbnail)}
                    alt='Thumbnail preview'
                    className='w-full h-full object-cover rounded'
                  />
                  <button
                    onClick={() => !isUploading && removeThumbnail()}
                    className={`absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isUploading}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Conditionally render file upload for driveUpload */}
        {currentAction?.driveUpload && !isUploading && (
          <div className='flex gap-3 mt-4 flex-col items-start w-full'>
            <div
              className={`flex gap-2 items-center justify-center ${
                isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => !isUploading && fileInputRef.current.click()}
            >
              <p className='text-text3Medium text-sec2-500'>Upload Files</p>
              <img
                src='/Images/ComponentIcons/UploadFile.svg'
                className='w-8 h-8'
                alt=''
              />
            </div>
            <input
              type='file'
              ref={fileInputRef}
              multiple
              accept='image/*,video/*'
              className='hidden'
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <div className='flex flex-wrap gap-2 mt-2'>
              {mediaData.files.map((file, index) => (
                <div key={index} className='relative w-24 h-24 border p-1'>
                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt='preview'
                      className='w-full h-full object-cover rounded'
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className='w-full h-full object-cover rounded'
                    />
                  )}
                  <button
                    onClick={() => !isUploading && removeFile(index)}
                    className={`absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isUploading}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='w-full flex gap-3 items-center justify-end mt-4'>
        <Button
          text='Cancel'
          onClick={(e) => handleCloseCrud(e)}
          buttonStyles={`bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6 ${
            isUploading ? "opacity-75" : ""
          }`}
        />
        <Button
          text={isUploading ? "Uploading..." : "Save"}
          onClick={(e) => !isUploading && saveData(e)}
          buttonStyles={`${
            isUploading
              ? "bg-secondary-500 cursor-not-allowed"
              : "bg-secondary-800 hover:bg-secondary-700"
          } text-white py-2 px-6`}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
