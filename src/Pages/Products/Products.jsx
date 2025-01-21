import { useLocation, useNavigate } from "react-router-dom";
import { SelectComponent } from "../../components/SelectComponent";
import Button from "../../components/Button";
import { useState } from "react";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState({
    image: "",
    productName: "",
    stock: "",
    price: "",
    type: "",
    location: "",
    event: "",
    shortDescription: "",
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductData({
      image: "",
      productName: "",
      stock: "",
      price: "",
      type: "",
      location: "",
      event: "",
      shortDescription: "",
    });
  };
  return (
    <div className="w-full bg-white py-6 px-8 rounded-lg">
      <div className="w-full flex justify-start items-center gap-4 relative text-text2">
        <div
          className={`w-28 text-center cursor-pointer transition-all duration-200 ${
            location.pathname === "/products/product-store"
              ? "text-secondary-700"
              : "text-primary2-500"
          }`}
          onClick={() => navigate("/products/product-store")}
        >
          Product Store
        </div>
        <div
          className={`w-32 text-center cursor-pointer transition-all duration-200 ${
            location.pathname === "/products/order-history"
              ? "text-secondary-700"
              : "text-primary2-500"
          }`}
          onClick={() => navigate("/products/order-history")}
        >
          Orders’ History
        </div>
        <div
          className={`absolute bottom-0 h-[1px] bg-secondary-700 transition-all duration-200 ${
            location.pathname === "/products/product-store"
              ? "left-0 w-28"
              : "left-32 w-32"
          }`}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-text3 uppercase">
          {location.pathname === "/products/product-store"
            ? "Products"
            : "Order History"}
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by product"
            className="border border-primary2-200 rounded-md px-2 py-1 h-10"
          />
          <SelectComponent withoutLabelMargin={true} />
          <Button
            text="Create"
            buttonStyles="bg-secondary-700 text-white hover:bg-secondary-600"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      Table
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
            
          </div>
        </div>
      )}
    </div>
  );
}
