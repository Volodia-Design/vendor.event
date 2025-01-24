import useActiveTab from "../store/useActiveTab";
import useAuth from "../store/useAuth";
import { useApiImage } from "../utils/useApiImage";

export default function Header() {
  const { activeTab } = useActiveTab();
  const { user } = useAuth();
  const { imageUrl } = useApiImage(user?.image);

  return (
    <div className="flex items-center justify-between w-full bg-white p-3 rounded-lg">
      <p className="text-text1Medium text-primary2-500 uppercase">{activeTab}</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full border border-secondary-700 flex items-center justify-center">
          <img
            src="/Images/ComponentIcons/Notification.svg"
            alt="notification"
            className="w-6 h-6 cursor-pointer"
          />
        </div>{" "}
        <img src={imageUrl} alt="profile" className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
}
