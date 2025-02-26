import PropTypes from "prop-types";
import { cn } from "../utils";

export default function Button({
  text,
  imgSrc,
  imgAlt,
  onClick,
  buttonStyles,
  textStyles,
  imgStyles,
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 p-2 rounded-lg duration-300 ease-in-out cursor-pointer h-[42px]",
        buttonStyles
      )}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={imgAlt || "Button image"}
          className={`w-6 h-6 ${imgStyles}`}
        />
      )}
      {text && <span className={textStyles}>{text}</span>}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  onClick: PropTypes.func,
  buttonStyles: PropTypes.string,
  textStyles: PropTypes.string,
  imgStyles: PropTypes.string,
};
