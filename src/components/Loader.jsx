export default function Loader() {
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