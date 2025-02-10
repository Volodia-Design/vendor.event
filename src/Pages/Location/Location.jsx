import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import Button from "../../components/Button";
import api from "../../utils/api";
import useCurrentWidth from "../../utils/useCurrentWidth";
import useModal from "../../store/useModal";
import LocationCrud from "./LocationCrud";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import useLoading from "../../store/useLoading";

export default function Location() {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { setIsLoading, startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const { isDesktop } = useCurrentWidth();
  const {
    onOpen,
    needToRefetch,
    setNeedToRefetch,
    openDeleteModal,
    showSuccess,
    showError,
  } = useModal();

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const getLocations = () => {
    api
      .get(
        `/location?page=${paginationData.currentPage}&limit=${paginationData.pageSize}&search=${searchTerm}`
      )
      .then((response) => {
        setLocations(response.data.data.data);
        setPaginationData({
          ...paginationData,
          totalPages: response.data.data.total,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderCols = () => {
    return (
      <tr className="bg-primary2-50 border border-primary2-50">
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Location
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Email
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Phone Number
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Location Address
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Responsive Person
        </th>
        <th className="text-center p-4 text-text3Medium text-primary2-500">
          Working Days, hours
        </th>
        <th className="text-center p-4 text-text3Medium text-primary2-500">
          Actions
        </th>
      </tr>
    );
  };

  const daysAbbreviationMap = {
    Monday: "Mo",
    Tuesday: "Tu",
    Wednesday: "We",
    Thursday: "Th",
    Friday: "Fr",
    Saturday: "Sa",
    Sunday: "Su",
    "All Week": "All Week",
  };

  const getAbbreviatedDays = (days) => {
    console.log("🚀 ~ getAbbreviatedDays ~ days:", days);

    return days
      .split(/\s*,\s*/)
      .map((day) => daysAbbreviationMap[day.trim()] || day.trim())
      .join(", ");
  };

  const renderRows = () => {
    return locations.map((item) => (
      <tr key={item.id} className="border hover:bg-primary2-50/50">
        <td className="p-4 text-text3 text-black-300">{item.name}</td>
        <td className="p-4 text-black-300 max-w-md truncate text-text4">
          {item.email}
        </td>
        <td className="p-4 text-text3 text-black-300">{item.phone}</td>
        <td className="p-4 text-text3 text-black-300">{item.fullAddress}</td>
        <td className="p-4 text-text3 text-black-300">{item.vendor_employee?.map((person) => person.fullName).join(", ")}</td>
        <td className="p-4 text-text3 text-black-300">
          <div className="flex justify-between items-center w-full">
            <p>{getAbbreviatedDays(item.workingDays)},</p>
            <p>
              {item.workingHoursFrom} - {item.workingHoursTo}
            </p>
          </div>
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

  const handleSearch = () => {
    getLocations();
  };

  const handleCrud = (action) => {
    const props =
      action.type === "create"
        ? { action }
        : { action, editableLocation: action.data };
    if (isDesktop) {
      onOpen(
        <LocationCrud {...props} />,
        "!max-w-2xl max-h-[99vh] overflow-auto"
      );
    } else {
      navigate("/location/crud", { state: props });
    }
  };

  const handlePageChange = (page) => {
    setPaginationData((prevData) => ({
      ...prevData,
      currentPage: page,
    }));
  };

  const handleDelete = (location) => {
    openDeleteModal({
      id: location.id,
      type: "location",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await api.delete(`/location/${location.id}`);
          showSuccess();
          getLocations();
        } catch (error) {
          showError();
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    getLocations();
    setNeedToRefetch(false);
  }, [needToRefetch, paginationData.currentPage]);

  useEffect(() => {
    if (searchTerm === "") {
      getLocations();
    }
  }, [searchTerm]);
  return (
    <div className="w-full flex flex-col items-center gap-3 bg-white p-3 rounded-2xl lg:px-6 px-2">
      <div className="flex lg:items-center items-start justify-between w-full lg:flex-row flex-col">
        <p className="text-text2Medium uppercase md:block hidden">Location</p>
        <div className="flex lg:items-center items-end gap-3 lg:flex-row flex-col lg:w-auto w-full">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by location"
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

          <Button
            text="Create a Location"
            buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2"
            onClick={() => handleCrud({ type: "create", data: null })}
          />
        </div>
      </div>
      <div className="mt-3 overflow-auto w-full">
        <TableComponent renderCols={renderCols} renderRows={renderRows} />
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
