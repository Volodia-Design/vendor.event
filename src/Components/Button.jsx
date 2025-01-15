import PropTypes from 'prop-types';
export default function Button({
    name,
    onClick,
    styles,
    type = "button",
    img,
  }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${styles} hover:brightness-125 transition-all duration-200 flex items-center justify-center`}
      >
        {img && <img src={img} alt="button icon" className="mr-2" />}
        {name}
      </button>
    );
  }

  Button.propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func,
    styles: PropTypes.string,
    type: PropTypes.string,
    img: PropTypes.string,
  };
  