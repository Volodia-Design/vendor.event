// components/Loader.jsx
import Image from "next/image";

export default function Loader() {
  return (
    <div className="wrapper">
      <div className="content">
        <Image
          src="/Logos/Logo.svg"
          alt="Loading..."
          width={56}
          height={56}
          priority
        />
        <div className="loadingBar">
          <div className="loadingBar"></div>
        </div>
      </div>
    </div>
  );
}