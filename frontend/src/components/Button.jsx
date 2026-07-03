function Button({ children, type = "button" }) {
  return (
    <button className="primary-button" type={type}>
      {children}
    </button>
  );
}

export default Button;