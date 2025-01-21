import useActiveTab from "../store/useActiveTab";

export default function Header() {
  const { activeTab } = useActiveTab();
  return (
      <div className="flex items-center justify-between w-full bg-white p-3 px-6 rounded-lg">
        <p className="text-text2 text-primary2-500 uppercase">{activeTab}</p>
        <p className="text-text2 text-primary2-500">Vendor</p>
      </div>
  );
}
