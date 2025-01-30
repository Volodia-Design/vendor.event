import ReactPaginate from "react-paginate";

const Pagination = ({ paginationData, onPageChange }) => {
  const { totalPages, pageSize, currentPage } = paginationData;
  const pageCount = Math.ceil(totalPages / pageSize);

  return (
    <ReactPaginate
      previousLabel={
        <img
          src="/Images/ComponentIcons/PaginationArrow.svg"
          alt="Previous"
          className={`w-6 h-6 ${
            currentPage === 1 ? "cursor-default opacity-50" : "cursor-pointer"
          } text-black-300`}
        />
      }
      nextLabel={
        <img
          src="/Images/ComponentIcons/PaginationArrow.svg"
          alt="Next"
          className={`w-6 h-6 rotate-180 ${
            currentPage === pageCount
              ? "cursor-default opacity-50"
              : "cursor-pointer"
          } text-black-300`}
        />
      }
      breakLabel={<span className="text-black-300">...</span>}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={"flex gap-2 justify-center mt-4"}
      pageClassName={"cursor-pointer text-black-300 px-3 py-1"}
      activeClassName={"bg-primary2-200 rounded-full text-white px-3 py-1"}
      previousClassName={"px-3 py-1 text-black-300"}
      nextClassName={"px-3 py-1 text-black-300"}
      breakClassName={"px-3 py-1 rounded cursor-pointer text-black-300"}
      disabledClassName={"opacity-50 cursor-default"}
      pageLinkClassName={"w-full h-full flex items-center justify-center"}
    />
  );
};

export default Pagination;
