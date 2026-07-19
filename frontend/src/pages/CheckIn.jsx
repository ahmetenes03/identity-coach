import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

import Button from "../components/Button";
import MoodRating from "../components/MoodRating";
import FailureReasonForm from "../components/FailureReasonForm";

import { createCheckIn, getHabitById } from "../services/habitService";
import { getApiErrorMessage } from "../services/api";
import { todayLocal } from "../utils/date";

import "../styles/checkin.css";

const REASON_LABELS = {
  tired: "Yorgundum",
  time: "Zaman bulamadım",
  forgot: "Unuttum",
  motivation: "Motivasyonum yoktu",
  difficult: "Çok zor geldi",
  other: "Başka bir neden",
};

function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [status, setStatus] = useState("");
  const [moodScore, setMoodScore] = useState(5);
  const [failureReason, setFailureReason] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [note, setNote] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus);
    setApiError("");
    if (selectedStatus === "done") {
      setFailureReason("");
      setReasonDetail("");
    }
  };

  const validateForm = () => {
    if (!status) {
      setApiError("Lütfen Yaptım veya Yapmadım seçeneğini seç.");
      return false;
    }
    if (status === "missed" && !failureReason) {
      setApiError("Lütfen alışkanlığı neden yapamadığını seç.");
      return false;
    }
    return true;
  };

  const buildCheckInNote = () => {
    if (status === "done") return note;
    return [
      `Neden: ${REASON_LABELS[failureReason]}`,
      reasonDetail ? `Açıklama: ${reasonDetail}` : "",
      note ? `Ek not: ${note}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  };

  const goToRecommendation = (checkInId) => {
    navigate(`/recommendation/${id}`, {
      state: {
        checkInId: checkInId ?? null,
        habit,
        status,
        moodScore: Number(moodScore),
        failureReason,
        reasonDetail,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setApiError("");
    try {
      const createdCheckIn = await createCheckIn({
        habit_id: id,
        check_date: todayLocal(),
        status,
        // Backend kuralı: mood_score yalnızca "done" için gönderilir.
        mood_score: status === "done" ? Number(moodScore) : null,
        note: buildCheckInNote(),
      });
      goToRecommendation(createdCheckIn?.id);
    } catch (error) {
      // Bugün için kayıt zaten varsa öneriye yine de geçilebilir (koç
      // check_in_id olmadan da çalışır).
      if (error.response?.status === 409) {
        goToRecommendation(null);
        return;
      }
      setApiError(getApiErrorMessage(error, "Check-in kaydedilirken bir hata oluştu."));
      setSubmitting(false);
    }
  };

  if (!habit) {
    return (
      <main className="checkin-page">
        <p>Alışkanlık bilgileri yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="checkin-page">
      <section className="checkin-card">
        <div className="checkin-icon">
          <FaCheckCircle />
        </div>

        <h1>Günlük Check-in</h1>

        <p className="checkin-subtitle">
          Bugün <strong>{habit.title}</strong> alışkanlığını gerçekleştirdin mi?
        </p>

        {apiError && <div className="checkin-error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="checkin-options">
            <button
              type="button"
              className={
                status === "done" ? "status-button done active" : "status-button done"
              }
              onClick={() => handleStatusChange("done")}
            >
              <span>✅</span>
              <strong>Yaptım</strong>
              <small>Bugünkü hedefimi tamamladım.</small>
            </button>

            <button
              type="button"
              className={
                status === "missed"
                  ? "status-button missed active"
                  : "status-button missed"
              }
              onClick={() => handleStatusChange("missed")}
            >
              <span>❌</span>
              <strong>Yapmadım</strong>
              <small>Bugün hedefimi tamamlayamadım.</small>
            </button>
          </div>

          {/* Ruh hâli yalnızca "done" için kaydedilir; missed'de toplanmaz. */}
          {status === "done" && (
            <MoodRating value={moodScore} onChange={setMoodScore} />
          )}

          {status === "missed" && (
            <FailureReasonForm
              selectedReason={failureReason}
              reasonDetail={reasonDetail}
              onReasonChange={setFailureReason}
              onReasonDetailChange={setReasonDetail}
            />
          )}

          {status && (
            <div className="checkin-note-section">
              <label htmlFor="checkInNote">
                {status === "done"
                  ? "Bugün neyin iyi gitmesini sağladı? (isteğe bağlı)"
                  : "Eklemek istediğin başka bir not var mı? (isteğe bağlı)"}
              </label>

              <textarea
                id="checkInNote"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={
                  status === "done"
                    ? "Örn: Sabah erken başladığım için daha kolay oldu."
                    : "Bugünkü deneyimini biraz daha anlatabilirsin."
                }
                maxLength={500}
              />
            </div>
          )}

          {status && (
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Kaydediliyor..."
                : status === "missed"
                  ? "Kaydet ve Koçtan Öneri Al"
                  : "Check-in'i Kaydet"}
            </Button>
          )}
        </form>
      </section>
    </main>
  );
}

export default CheckIn;
