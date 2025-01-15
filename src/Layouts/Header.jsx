import useActiveTab from "../store/useActiveTab";

export default function Header() {
  const { activeTab } = useActiveTab();
  console.log("🚀 ~ Header ~ activeTab:", activeTab);
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-primary2-500 text-h2 uppercase">{activeTab}</p>
      <div className="flex items-center gap-3 border border-primary-700 rounded-full px-3 py-1">v</div>
      </div>
  );
}
