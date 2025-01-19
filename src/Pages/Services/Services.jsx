import Button from "../../Components/Button";

export default function Services() {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-between w-full bg-white p-3 rounded-lg">
        <div className="flex items-center justify-between w-full">
          <p className="text-text3 uppercase">My Services</p>
          <Button
            name="Create a Service"
            styles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <select className="p-3 border border-neutral-200 rounded-lg text-text2 focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option>Filter by Status</option>
          </select>
          <img src="/Images/ComponentIcons/SelectArrow.svg" alt="arrow" />
        </div>
      </div>
      <div className="flex items-center justify-between w-full bg-white p-3 rounded-lg">
        Table
      </div>
    </div>
  );
}
