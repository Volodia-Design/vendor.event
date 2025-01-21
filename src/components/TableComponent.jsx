export default function TableComponent({ renderCols, renderRows }) {
  return (
    <div className="w-full">
      <table className="w-full bg-white rounded-lg border-collapse overflow-hidden">
        <thead className="border border-primary2-50">{renderCols()}</thead>
        <tbody className="border border-black-100">{renderRows()}</tbody>
      </table>
    </div>
  );
}
