import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import ProtectedMainLayout from "./Layouts/ProtectedMainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import History from "./Pages/History/History";
import Timeline from "./Pages/Timeline/Timeline";
import Settings from "./Pages/Settings/Settings";
import Gallery from "./Pages/Gallery/Gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedMainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/timeline" element={<Timeline /> } />
          <Route path="/settings" element={<Settings /> } />
          <Route path="/gallery" element={<Gallery /> } />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
