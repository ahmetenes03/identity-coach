import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Button from "../components/Button";
import Input from "../components/Input";
import { getHabitById, updateHabit } from "../services/habitService";
import "../styles/habit.css";

function HabitEdit() {
  const { id } = useParams();
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

  useEffect(() => {
    const loadHabit = async () => {
      try {
        const habit = await getHabitById(id);

        if (!habit) {
          navigate("/dashboard");
          return;
        }

        setFormData({
          identity_text: habit.identity_text || "",
          title: habit.title || "",
          goal_text: habit.goal_text || "",
          frequency: habit.frequency || "daily",
          preferred_time: habit.preferred_time || "morning",
        });
      } catch {
        navigate("/dashboard");
      }
    };

    loadHabit();
  }, [id, navigate]);

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
      await updateHabit(id, formData);
      navigate("/dashboard");
    } catch (error) {
      setApiError(error.response?.data?.detail || "Alışkanlık güncellenirken hata oluştu.");
    }
  };

  return (
    <div className="habit-page">
      <div className="habit-card">
        <div className="habit-icon">
          <FaEdit />
        </div>

        <h1>Alışkanlığı Düzenle</h1>
        <p className="habit-subtitle">Alışkanlık bilgilerini güncelleyebilirsin.</p>

        {apiError && <div className="error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Kimlik Cümlesi"
            name="identity_text"
            value={formData.identity_text}
            onChange={handleChange}
            error={errors.identity_text}
            required
          />

          <Input
            label="Alışkanlık Adı"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Input
            label="Hedef Açıklaması"
            name="goal_text"
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

          <Button type="submit">Değişiklikleri Kaydet</Button>
        </form>
      </div>
    </div>
  );
}

export default HabitEdit;