import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import Button from "../components/Button";
import Input from "../components/Input";
import { createHabit } from "../services/habitService";
import "../styles/habit.css";

function HabitCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identity_text: "",
    title: "",
    goal_text: "",
    frequency: "daily",
    preferred_time: "morning",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identity_text.trim()) newErrors.identity_text = "Kimlik cümlesi boş bırakılamaz.";
    if (!formData.title.trim()) newErrors.title = "Alışkanlık adı boş bırakılamaz.";
    if (!formData.goal_text.trim()) newErrors.goal_text = "Hedef açıklaması boş bırakılamaz.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createHabit(formData);
      navigate("/dashboard");
    } catch (error) {
      setApiError(error.response?.data?.detail || "Alışkanlık oluşturulurken hata oluştu.");
    }
  };

  return (
    <div className="habit-page">
      <div className="habit-card">
        <div className="habit-icon">
          <FaBrain />
        </div>

        <h1>Yeni Alışkanlık Oluştur</h1>
        <p className="habit-subtitle">
          Önce kim olmak istediğini tanımla, sonra bu kimliği destekleyen alışkanlığı oluştur.
        </p>

        {apiError && <div className="error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Kimlik Cümlesi"
            name="identity_text"
            placeholder="Örn: Ben her gün kitap okuyan bir insanım."
            value={formData.identity_text}
            onChange={handleChange}
            error={errors.identity_text}
            required
          />

          <Input
            label="Alışkanlık Adı"
            name="title"
            placeholder="Örn: Kitap okumak"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Input
            label="Hedef Açıklaması"
            name="goal_text"
            placeholder="Örn: Her gün 20 dakika kitap okuyacağım."
            value={formData.goal_text}
            onChange={handleChange}
            error={errors.goal_text}
            required
          />

          <div className="form-group">
            <label>Sıklık <span className="required">*</span></label>
            <select name="frequency" value={formData.frequency} onChange={handleChange}>
              <option value="daily">Günlük</option>
              <option value="weekly">Haftalık</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tercih Edilen Zaman <span className="required">*</span></label>
            <select name="preferred_time" value={formData.preferred_time} onChange={handleChange}>
              <option value="morning">🌞 Sabah</option>
              <option value="noon">☀️ Öğlen</option>
              <option value="evening">🌙 Akşam</option>
              <option value="anytime">✨ Fark etmez</option>
            </select>
          </div>

          <Button type="submit">Alışkanlığı Kaydet</Button>
        </form>
      </div>
    </div>
  );
}

export default HabitCreate;