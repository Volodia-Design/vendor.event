import { useEffect, useState } from "react";

const ImageUpload = ({ setImage, error, image, editMode = false }) => {
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  useEffect(() => {
    // Update preview when `image` or `editMode` changes
    if (editMode && typeof image === "string") {
      setSelectedImagePreview(image);
    }
  }, [image, editMode]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImagePreview(imageUrl); // Preview URL for display
      setImage(file); // Set the binary file
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImagePreview(imageUrl);
      setImage(file); // Set the binary file
    }
  };

  const handleRemoveImage = () => {
    setSelectedImagePreview(null);
    setImage(null); // Reset the file
    document.getElementById("fileInput").value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-2 border border-primary2-100 rounded-lg">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-4 p-12 rounded-lg cursor-pointer relative ${
          selectedImagePreview ? "" : "bg-primary2-50"
        }`}
      >
        {selectedImagePreview ? (
          <div style={{ position: "relative", marginTop: "10px" }}>
            <img
              src={selectedImagePreview}
              alt="Selected Preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <button
              onClick={handleRemoveImage}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &times;
            </button>
          </div>
        ) : (
          <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center justify-center gap-4">
            <img
              src="/Images/ComponentIcons/ImageUploadIcon.svg"
              alt="Upload Icon"
              style={{ width: "50px", height: "50px", marginBottom: "10px" }}
            />
            <p className="text-primary2-500">
              Click or drag the file here to upload
            </p>
          </label>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="fileInput"
        />
      </div>
      {error && <p className="text-red-500 mt-2 text-text4Medium">{error}</p>}
    </div>
  );
};

export default ImageUpload;
