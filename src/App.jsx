import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedMainLayout from "./Layouts/ProtectedMainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Services from "./Pages/Services/Services";
import Schedule from "./Pages/Schedule/Schedule";
import Products from "./Pages/Products/Products";
import Portfolio from "./Pages/Portfolio/Portfolio";
import AboutUs from "./Pages/AboutUs/AboutUs";
import People from "./Pages/People/People";
import Location from "./Pages/Location/Location";
import Settings from "./Pages/Settings/Settings";
import "swiper/css";
import "swiper/css/pagination";
import useModal from "./store/useModal";
import ModalComponent from "./components/ModalComponent";

function App() {
  const { isOpen, content, closeModal } = useModal();

  return (
    <Router>
            <ModalComponent isOpen={isOpen} content={content} onClose={closeModal} />
      <Routes>
        <Route element={<ProtectedMainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/products" element={<Products />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/people" element={<People />} />
          <Route path="/location" element={<Location />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
