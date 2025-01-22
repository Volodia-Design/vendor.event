import useLoading from "../store/useLoading";

export default function Loader() {
  const isLoading = useLoading((state) => state.isLoading);

  if (!isLoading) return null;
  return (
    <div className="wrapper">
      <div className="content">
        <img
          src="/Logo.svg"
          alt="Loading..."
        />
        <div className="loadingBar">
          <div className="loadingBar"></div>
        </div>
      </div>
    </div>
  );
}