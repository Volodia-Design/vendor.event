import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import Button from "../../components/Button";
import api from "../../utils/api";
import useCurrentWidth from "../../utils/useCurrentWidth";
import useModal from "../../store/useModal";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import useLoading from "../../store/useLoading";
import StaffCrud from "./StaffCrud";

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const { setIsLoading } = useLoading();
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

  const getStaffs = () => {
    api
      .get(`/vendor-employee?page=${paginationData.currentPage}&limit=${paginationData.pageSize}`)
      .then((response) => {
        setStaffs(response.data.data.data);
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
          Responsible Person
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Email
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Attached Location
        </th>
        <th className="text-left p-4 text-text3Medium text-primary2-500">
          Location Address
        </th>
        <th className="text-center p-4 text-text3Medium text-primary2-500">
          Actions
        </th>
      </tr>
    );
  };

  const renderRows = () => {
    return staffs.map((item) => (
      <tr key={item.id} className="border hover:bg-primary2-50/50">
        <td className="p-4 text-text3 text-black-300">{item.user.fullName}</td>
        <td className="p-4 text-black-300 max-w-md truncate text-text4">
          {item.user.email}
        </td>
        <td className="p-4 text-text3 text-black-300">{item.location?.name}</td>
        <td className="p-4 text-text3 text-black-300">{item.location?.fullAddress}</td>
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

  const handleCrud = (action) => {
    const props =
      action.type === "create"
        ? { action }
        : { action, editableStaff: action.data };
    if (isDesktop) {
      onOpen(<StaffCrud {...props} />, "!max-w-2xl max-h-[99vh] overflow-auto");
    } else {
      navigate("/staff/crud", { state: props });
    }
  };

  const handlePageChange = (page) => {
    setPaginationData((prevData) => ({
      ...prevData,
      currentPage: page,
    }));
  };
  

  const handleDelete = (staff) => {
    openDeleteModal({
      id: staff.id,
      type: "staff",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await api.delete(`/vendor-employee/${staff.id}`);
          showSuccess();
          getStaffs();
        } catch (error) {
          showError();
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    getStaffs();
    setNeedToRefetch(false);
  }, [needToRefetch, paginationData.currentPage]);
  return (
    <div className="w-full flex flex-col items-center gap-3 bg-white p-3 rounded-2xl lg:px-6 px-2">
      <div className="flex lg:items-center items-start justify-between w-full lg:flex-row flex-col">
        <p className="text-text2Medium uppercase md:block hidden">Staff</p>
        <div className="flex lg:items-center items-end gap-3 lg:flex-row flex-col lg:w-auto w-full">
          <Button
            text="Create a Responsive Person"
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
