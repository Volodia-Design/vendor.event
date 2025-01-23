import useActiveTab from "../store/useActiveTab";
import useAuth from "../store/useAuth";

export default function Header() {
  const { activeTab } = useActiveTab();
  const { user } = useAuth();
  console.log("🚀 ~ Header ~ user:", user)

  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-primary2-500 text-h2 uppercase">{activeTab}</p>
      <div className="flex items-center gap-3 border border-primary-700 rounded-full px-3 py-1">{user.fullName}</div>
      </div>
  );
}
