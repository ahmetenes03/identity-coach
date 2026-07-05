import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";
import { loginUser } from "../services/authService";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "E-posta alanı boş bırakılamaz.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz.";
    }

    if (!formData.password) {
      newErrors.password = "Şifre alanı boş bırakılamaz.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await loginUser(formData);
      navigate("/dashboard");
    } catch (error) {
      setApiError(
        error.response?.data?.detail || "Giriş işlemi sırasında bir hata oluştu."
      );
    }
  };

  return (
    <AuthLayout title="Identity Coach" subtitle="Giriş Yap">
      {apiError && <div className="error">{apiError}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="E-posta"
          type="email"
          name="email"
          placeholder="ornek@mail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Şifre"
          type="password"
          name="password"
          placeholder="Şifrenizi girin"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Button type="submit">Giriş Yap</Button>
      </form>

      <p>
        Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;