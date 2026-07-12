import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaBrain,
  FaCheckCircle,
  FaLightbulb,
  FaFire,
} from "react-icons/fa";
import Button from "../components/Button";
import { createCheckIn, getHabitById } from "../services/habitService";
import { reflectOnFailure } from "../services/coachService";
import { getApiErrorMessage } from "../services/api";
import { todayLocal } from "../utils/date";
import "../styles/checkin.css";

const STATUS_OPTIONS = [
  { value: "done", label: "✅ Yaptım" },
  { value: "missed", label: "❌ Yapmadım" },
];

function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [status, setStatus] = useState("");
  const [moodScore, setMoodScore] = useState(7);
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [coachResult, setCoachResult] = useState(null);
  // Check-in bir kez oluşturulduktan sonra id'si saklanır; koç çağrısı
  // başarısız olursa yeniden gönderim check-in'i TEKRAR oluşturmaya çalışıp
  // 409'a takılmaz, yalnızca koçluk yeniden denenir.
  const [savedCheckInId, setSavedCheckInId] = useState(null);

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
    setApiError("");

    if (!status) {
      setApiError("Lütfen Yaptım veya Yapmadım seçeneğini seç.");
      return;
    }
    if (status === "missed" && reason.trim().length < 3) {
      setApiError("Koçun yardımcı olabilmesi için kısaca nedenini yaz.");
      return;
    }

    setSubmitting(true);

    // 1) Check-in'i kaydet (daha önce kaydedildiyse atla).
    let checkInId = savedCheckInId;
    if (!checkInId) {
      try {
        const checkIn = await createCheckIn({
          habit_id: id,
          check_date: todayLocal(),
          status,
          // Backend kuralı: mood_score yalnızca "done" için gönderilir.
          mood_score: status === "done" ? Number(moodScore) : null,
          note: status === "done" ? note : reason,
        });
        checkInId = checkIn.id;
        setSavedCheckInId(checkIn.id);
      } catch (error) {
        // Bugün için kayıt zaten varsa (ör. önceki denemede oluştu) koçluğa
        // yine de devam edilebilir; diğer hatalarda dur.
        if (!(status === "missed" && error.response?.status === 409)) {
          setApiError(
            getApiErrorMessage(error, "Check-in kaydedilirken hata oluştu.")
          );
          setSubmitting(false);
          return;
        }
      }
    }

    if (status === "done") {
      toast.success("Harika! Kimliğine bir oy daha verdin. 🎉");
      setSubmitting(false);
      navigate("/dashboard");
      return;
    }

    // 2) Kaçırıldı → AI koçtan kişisel öneri al (başarısızsa tek başına
    //    yeniden denenebilir; check-in kaydı korunur).
    try {
      const coaching = await reflectOnFailure({
        habit_id: id,
        reason_text: reason.trim(),
        check_in_id: checkInId ?? undefined,
      });
      setCoachResult(coaching);
    } catch (error) {
      setApiError(
        getApiErrorMessage(
          error,
          "Koç yanıtı alınamadı. Check-in kaydın korundu — tekrar deneyebilirsin."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!habit) return null;

  // ---- Koç yanıtı ekranı -------------------------------------------------
  if (coachResult) {
    return (
      <div className="checkin-page">
        <div className="checkin-card coach-card">
          <div className="checkin-icon coach-icon">
            <FaBrain />
          </div>

          <h1>Koçundan Not</h1>
          <div className="coach-badges">
            <span className="coach-badge">
              {coachResult.category_label || coachResult.category}
            </span>
            {coachResult.streak > 0 && (
              <span className="coach-badge streak">
                <FaFire /> {coachResult.streak} günlük seri
              </span>
            )}
          </div>

          <p className="coach-message">{coachResult.message}</p>

          {coachResult.strategies?.length > 0 && (
            <div className="coach-strategies">
              <h3>
                <FaLightbulb /> Sana uygun stratejiler
              </h3>
              <ul>
                {coachResult.strategies.map((strategy) => (
                  <li key={strategy.id}>
                    <strong>{strategy.title}</strong>
                    <span>{strategy.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={() => navigate("/dashboard")}>
            Anladım, devam ediyorum
          </Button>
        </div>
      </div>
    );
  }

  // ---- Check-in formu ------------------------------------------------------
  return (
    <div className="checkin-page">
      <div className="checkin-card">
        <Link to="/dashboard" className="back-link">
          <FaArrowLeft /> Dashboard
        </Link>

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
            {STATUS_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`status-button ${value}${status === value ? " active" : ""}`}
                onClick={() => setStatus(value)}
                disabled={Boolean(savedCheckInId)}
              >
                {label}
              </button>
            ))}
          </div>

          {status === "done" && (
            <>
              <label className="note-label">Ruh Hali Puanı: {moodScore}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(e.target.value)}
                className="mood-slider"
              />

              <label className="note-label">Not (isteğe bağlı)</label>
              <textarea
                placeholder="Bugün bu alışkanlıkla ilgili kısa bir not yazabilirsin."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </>
          )}

          {status === "missed" && (
            <>
              <label className="note-label">Bugün ne engel oldu?</label>
              <textarea
                placeholder="Örn: Çok yorgundum, işten geç çıktım..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={2000}
                disabled={Boolean(savedCheckInId)}
              />
              <p className="coach-hint">
                <FaBrain /> Nedenini paylaşırsan yapay zekâ koçun sana özel bir
                öneri hazırlar.
              </p>
            </>
          )}

          {status && (
            <Button type="submit" disabled={submitting}>
              {submitting
                ? status === "missed"
                  ? "Koçun düşünüyor..."
                  : "Kaydediliyor..."
                : savedCheckInId
                  ? "Koçtan tekrar iste"
                  : "Check-in Kaydet"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default CheckIn;
