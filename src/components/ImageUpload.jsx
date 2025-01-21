import { useState } from "react";

const ImageUpload = ({ setImage, error }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImage(imageUrl); 
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImage(imageUrl); 
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImage(""); 
    document.getElementById("fileInput").value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-2 border border-primary2-100 rounded-lg">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-4 p-12 rounded-lg cursor-pointer relative ${selectedImage ? "" : "bg-primary2-50"}`}
      >
        {selectedImage ? (
          <div style={{ position: "relative", marginTop: "10px" }}>
            <img
              src={selectedImage}
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
