import { cn } from "../utils";

export default function Spinner({
  isLoading = false,
  fixed = true,
  className,
}) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "loadingBar z-50",
        fixed && "!fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ",
        className
      )}
    >
      <div className='loadingBar'></div>
    </div>
  );
}
