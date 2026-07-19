function Button({ children, type = "button", disabled = false, onClick }) {
  return (
    <button
      className="primary-button"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
