import { useState } from "react";
import VendorIcon from "../../Images/LoginViewIcons/Vendor.svg";
import EventPlannerIcon from "../../Images/LoginViewIcons/EventPlanner.svg";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import useAuth from "../../store/useAuth";
export default function Login() {
  const [globalState, setGlobalState] = useState({
    currentView: "login",
    values: {
      userType: null,
    },
  });

  const { login } = useAuth();

  const navigate = useNavigate();

  // const changeView = (view) => {
  //   setGlobalState((prev) => ({
  //     ...prev,
  //     currentView: view,
  //   }));

  // };
  const [selected, setSelected] = useState("");

  const handleClick = (role) => {
    setSelected(role);
  };

  const changeView = (view) => {
    login({
      isLoggedIn: true,
      user: {
        role: selected,
      },
    });

    navigate("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-2xl flex flex-col items-center gap-3">
        <p className="text-h4">SIGN UP</p>
        <p className="text-text3">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </p>
        <div className="flex gap-5 mt-3 w-full">
          <div
            className={`border rounded-2xl w-full flex flex-col items-center gap-3 py-6 ${
              selected === "vendor" ? "border-primary2-100 bg-blue-100" : ""
            }`}
            onClick={() => handleClick("vendor")}
          >
            <img src={VendorIcon} alt="Vendor Icon" />
            <p className="text-text3Medium">I am a Vendor</p>
          </div>
          <div
            className={`border rounded-2xl w-full flex flex-col items-center gap-3 py-6 ${
              selected === "eventPlanner"
                ? "border-primary2-50 bg-blue-100"
                : ""
            }`}
            onClick={() => handleClick("eventPlanner")}
          >
            <img src={EventPlannerIcon} alt="Event Planner Icon" />
            <p className="text-text3Medium">I am an Event Planner</p>
          </div>
        </div>
        <Button
          name="Create an account"
          onClick={() => changeView("signup")}
          styles="w-full bg-secondary-700 p-3 rounded-lg text-white mt-5"
        />
      </div>
    </div>
  );
}
