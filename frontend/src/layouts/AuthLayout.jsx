import "../styles/auth.css";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="container">
      <div className="card">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;