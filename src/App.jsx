import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedMainLayout from "./Layouts/ProtectedMainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Services from "./Pages/Services/Services";
import Schedule from "./Pages/Schedule/Schedule";
import Products from "./Pages/Products/Products";
import Portfolio from "./Pages/Portfolio/Portfolio";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Location from "./Pages/Location/Location";
import Settings from "./Pages/Settings/Settings";
import "swiper/css";
import "swiper/css/pagination";
import "react-tooltip/dist/react-tooltip.css";
import Loader from "./components/Loader";
import useModal from "./store/useModal";
import {
  DeleteConfirmationModal,
  ErrorModal,
  ModalComponent,
  SuccessModal,
} from "./components/ModalComponent";
import ServiceCrud from "./Pages/Services/ServiceCrud";
import LocationCrud from "./Pages/Location/LocationCrud";
import ProductCrud from "./Pages/Products/ProductCrud";
import Staff from "./Pages/Staff/Staff";
import StaffCrud from "./Pages/Staff/StaffCrud";

function App() {
  const {
    isOpen,
    content,
    onClose,
    isSuccessOpen,
    isErrorOpen,
    closeSuccess,
    closeError,
    className,
    isDeleteModalOpen,
    closeDeleteModal,
    deleteModalData,
  } = useModal();

  return (
    <Router>
      <Loader />
      {isOpen && content && (
        <ModalComponent
          isOpen={isOpen}
          onClose={onClose}
          content={content}
          className={className}
        />
      )}
      <SuccessModal isOpen={isSuccessOpen} onClose={closeSuccess} />
      <ErrorModal isOpen={isErrorOpen} onClose={closeError} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        data={deleteModalData}
      />
      <Routes>
        <Route element={<ProtectedMainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/crud" element={<ServiceCrud />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/products/product-store" element={<Products />} />
          <Route path="/products/order-history" element={<Products />} />
          <Route path="/product/crud" element={<ProductCrud />} />
          <Route path="/portfolio/*" element={<Portfolio />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/crud" element={<StaffCrud />} />
          <Route path="/location" element={<Location />} />
          <Route path="/location/crud" element={<LocationCrud />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
