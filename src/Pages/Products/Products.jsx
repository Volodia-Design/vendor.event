import { useLocation, useNavigate } from "react-router-dom";
import { SelectComponent } from "../../components/SelectComponent";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import useLoading from "../../store/useLoading";
import api from "../../utils/api";
import useServiceTypes from "../../store/data/useServiceTypes";
import useModal from "../../store/useModal";
import ProductCrud from "./ProductCrud";
import useCurrentWidth from "../../utils/useCurrentWidth";
import useLocations from "../../store/data/useLocations";
import Pagination from "../../components/Pagination";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { serviceTypes } = useServiceTypes();
  const [searchTerm, setSearchTerm] = useState("");
  const { locations } = useLocations();
  const {
    onOpen,
    needToRefetch,
    setNeedToRefetch,
    openDeleteModal,
    showSuccess,
    showError,
  } = useModal();
  const { isDesktop } = useCurrentWidth();
  const [allProducts, setAllProducts] = useState([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const getProductData = () => {
    setIsLoading(true);
    api
      .get(
        `/vendor-product?page=${paginationData.currentPage}&limit=${paginationData.pageSize}&search=${searchTerm}`
      )
      .then((response) => {
        setAllProducts(response.data.data.data);
        setPaginationData({
          ...paginationData,
          totalPages: response.data.data.total,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderCols = () => {
    return (
      <tr className="bg-primary2-50 border border-primary2-50">
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Product
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Details
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Stock
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Price
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Type
        </th>
        <th className="text-center p-4 text-text3Medium text-primary2-500">
          Actions
        </th>
      </tr>
    );
  };

  const renderRows = () => {
    return allProducts.map((item) => (
      <tr key={item.id} className="border hover:bg-primary2-50/50">
        <td className="p-4 text-text3 text-black-300">{item.name}</td>
        <td className="p-4 text-black-300 max-w-md truncate text-text4">
          {item.description.length > 50
            ? `${item.description.substring(0, 50)}...`
            : item.description}
        </td>
        <td className="p-4 text-text3 text-black-300">{item.stock}</td>
        <td className="p-4 text-text3 text-black-300">USD {item.price}</td>
        <td className="p-4 text-text3 text-black-300">
          {item.product_type?.name}
        </td>
        <td className="p-4 flex gap-2 items-center justify-center">
          <img
            src="/Images/ComponentIcons/EditColored.svg"
            alt="Edit"
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleCrud({ type: "edit", data: item })}
          />
          <img
            src="/Images/ComponentIcons/Delete.svg"
            alt="delete"
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleDelete(item)}
          />
        </td>
      </tr>
    ));
  };

  const handleCrud = async (action) => {
    console.log("🚀 ~ handleCrud ~ action:", action);
    if (action.type === "edit" && action.data) {
      // Create a new copy of the data
      let transformedData = {
        ...action.data,
        product_type_id: String(action.data.product_type_id),
        event_types: action.data.event_types.map((event) => String(event.id)),
        recipients: action.data.recipients.map((recipient) => String(recipient.id)),
        location_id: String(action.data.location_id),
      };

      // Handle image transformation
      if (action.data.image) {
        try {
          const response = await api.get(`/image/${action.data.image}`, {
            responseType: "blob",
          });
          transformedData.image = URL.createObjectURL(response.data);
        } catch (error) {
          console.error("Error loading image:", error);
          // Handle error appropriately
        }
      }

      // Update the action object
      action = {
        ...action,
        data: transformedData,
      };
    }

    const props = { action };

    if (isDesktop) {
      onOpen(
        <ProductCrud {...props} />,
        "!max-w-[50rem] max-h-[99vh] overflow-auto"
      );
    } else {
      navigate("/product/crud", { state: props });
    }
  };

  const handleDelete = (product) => {
    openDeleteModal({
      id: product.id,
      type: "product",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await api.delete(`/vendor-product/${product.id}`);
          showSuccess();
          getProductData();
        } catch (error) {
          showError();
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleSearch = () => {
    getProductData();
  };

  const handlePageChange = (page) => {
    setPaginationData((prevData) => ({
      ...prevData,
      currentPage: page,
    }));
  };

  useEffect(() => {
    getProductData();
    setNeedToRefetch(false);
  }, [needToRefetch, paginationData.currentPage]);

  useEffect(() => {
    if (searchTerm === "") {
      getProductData();
    }
  }, [searchTerm]);

  return (
    <div className="w-full bg-white p-3 rounded-2xl lg:px-6 px-2">
      {/* Navigation */}
      <div className="w-full flex justify-start items-center gap-4 relative text-text2">
        <div
          className={`w-32 text-center cursor-pointer transition-all duration-200 ${
            location.pathname === "/products/product-store"
              ? "text-secondary-700"
              : "text-primary2-500"
          }`}
          onClick={() => navigate("/products/product-store")}
        >
          Product Store
        </div>
        <div
          className={`w-36 text-center cursor-pointer transition-all duration-200 ${
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
              ? "left-0 w-32"
              : "left-36 w-36"
          }`}
        />
      </div>
      {/* Main Content */}
      <div className="mt-4 flex lg:items-center lg:flex-row justify-between flex-col items-start">
        <p className="text-text2Medium uppercase lg:block hidden">
          {location.pathname === "/products/product-store"
            ? "Products"
            : "Order History"}
        </p>
        <div className="flex md:items-center gap-3 flex-col md:flex-row items-end lg:mt-0 mt-4 lg:w-auto w-full">
          <div className="search-container w-full">
            <input
              type="text"
              placeholder="Search by product"
              className="search-input h-[42px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              className="search-button duration-300"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="search-icon"
              >
                <path d="M21.71 20.29l-5.4-5.39a8 8 0 10-1.42 1.42l5.4 5.4a1 1 0 001.42-1.42zM10 16a6 6 0 110-12 6 6 0 010 12z" />
              </svg>
            </button>
          </div>

          {/* Select components */}
          <SelectComponent
            withoutLabelMargin={true}
            id="locationSearch"
            options={locations}
            placeholder="All Locations"
            placeholderColor="text-black-200"
            className="lg:w-48 w-full"
            value={""}
            onChange={() => {}}
          />
          <Button
            text="Create"
            buttonStyles="bg-secondary-700 text-white hover:bg-secondary-600 px-7"
            onClick={() => handleCrud({ type: "create", data: null })}
          />
        </div>
      </div>
      {/* Table */}
      <div className="mt-6 overflow-auto">
        {location.pathname === "/products/product-store" && (
          <TableComponent renderCols={renderCols} renderRows={renderRows} />
        )}
      </div>
      <div className="w-full flex justify-end">
        <Pagination
          paginationData={paginationData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
