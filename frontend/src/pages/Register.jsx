import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";
import { registerUser } from "../services/authService";
import { getApiErrorMessage } from "../services/api";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ad Soyad alanı boş bırakılamaz.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-posta alanı boş bırakılamaz.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz.";
    }

    if (!formData.password) {
      newErrors.password = "Şifre alanı boş bırakılamaz.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Şifre en az 8 karakter olmalıdır.";
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
      await registerUser(formData);
      navigate("/dashboard");
    } catch (error) {
      setApiError(
        getApiErrorMessage(error, "Kayıt işlemi sırasında bir hata oluştu.")
      );
    }
  };

  return (
    <AuthLayout title="Identity Coach" subtitle="Hesap Oluştur">
      {apiError && <div className="error">{apiError}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Ad Soyad"
          type="text"
          name="name"
          placeholder="Adınızı girin"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

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

        <Button type="submit">Kayıt Ol</Button>
      </form>

      <p>
        Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;