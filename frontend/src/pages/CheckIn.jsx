import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../components/Button";
import { createCheckIn, getHabitById } from "../services/habitService";
import "../styles/checkin.css";

function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [status, setStatus] = useState("");
  const [moodScore, setMoodScore] = useState(5);
  const [note, setNote] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadHabit = async () => {
      try {
        const selectedHabit = await getHabitById(id);

        if (!selectedHabit) {
          navigate("/dashboard");
          return;
        }

        setHabit(selectedHabit);
      } catch {
        navigate("/dashboard");
      }
    };

    loadHabit();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      setApiError("Lütfen Yaptım veya Yapmadım seçeneğini seç.");
      return;
    }

    try {
      await createCheckIn({
        habit_id: id,
        check_date: new Date().toISOString().split("T")[0],
        status,
        mood_score: Number(moodScore),
        note,
      });

      navigate("/dashboard");
    } catch (error) {
      setApiError(error.response?.data?.detail || "Check-in kaydedilirken hata oluştu.");
    }
  };

  if (!habit) return null;

  return (
    <div className="checkin-page">
      <div className="checkin-card">
        <div className="checkin-icon">
          <FaCheckCircle />
        </div>

        <h1>Günlük Check-in</h1>
        <p className="checkin-subtitle">
          Bugün <strong>{habit.title}</strong> alışkanlığını gerçekleştirdin mi?
        </p>

        {apiError && <div className="error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="checkin-options">
            <button
              type="button"
              className={status === "done" ? "status-button active" : "status-button"}
              onClick={() => setStatus("done")}
            >
              ✅ Yaptım
            </button>

            <button
              type="button"
              className={status === "missed" ? "status-button active" : "status-button"}
              onClick={() => setStatus("missed")}
            >
              ❌ Yapmadım
            </button>
          </div>

          <label className="note-label">Ruh Hali Puanı</label>
          <select value={moodScore} onChange={(e) => setMoodScore(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>

          <label className="note-label">Not</label>
          <textarea
            placeholder="Bugün bu alışkanlıkla ilgili kısa bir not yazabilirsin."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <Button type="submit">Check-in Kaydet</Button>
        </form>
      </div>
    </div>
  );
}

export default CheckIn;