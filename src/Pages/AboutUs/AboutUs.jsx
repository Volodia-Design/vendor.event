import { useState, useEffect } from "react";
import Button from "../../components/Button";
import api from "../../utils/api";
import useLoading from "../../store/useLoading";
import useModal from "../../store/useModal";

export default function AboutUs() {
  const [aboutData, setAboutData] = useState("");
  const { setIsLoading } = useLoading();
  const {
    showSuccess,
    showError,
  } = useModal();

  useEffect(() => {
    getVendorAbout();
  }, []);

  const getVendorAbout = () => {
    setIsLoading(true);
    api
      .get("/vendor-about")
      .then((res) => {
        setAboutData(res.data.data.text);
      })
      .catch((err) => {
        console.error("Error fetching vendor about data:", err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  const saveData = () => {
    setIsLoading(true);
    api
      .put("/vendor-about", { text: aboutData })
      .then((res) => {
        showSuccess();
      })
      .catch((err) => {
        showError();
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  return (
    <div className="w-full flex flex-col items-start gap-3 bg-white p-3 rounded-2xl lg:px-6 px-2">
      <textarea
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary-500"
        placeholder="Short information about the Vendor"
        value={aboutData}
        onChange={(e) => setAboutData(e.target.value)}
        rows={4}
      />
      <div className="w-full flex gap-3 items-center justify-end mt-2">
        <Button
          text={"Save"}
          onClick={saveData}
          buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
        />
      </div>
    </div>
  );
}
