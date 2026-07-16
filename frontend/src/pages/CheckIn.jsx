import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

import Button from "../components/Button";
import MoodRating from "../components/MoodRating";
import FailureReasonForm from "../components/FailureReasonForm";

import {
  createCheckIn,
  getHabitById,
} from "../services/habitService";

import "../styles/checkin.css";

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
      setApiError(
        "Lütfen Yaptım veya Yapmadım seçeneğini seç."
      );
      return false;
    }

    if (
      !Number.isInteger(Number(moodScore)) ||
      Number(moodScore) < 1 ||
      Number(moodScore) > 10
    ) {
      setApiError(
        "Ruh hâli puanı 1 ile 10 arasında olmalıdır."
      );
      return false;
    }

    if (status === "missed" && !failureReason) {
      setApiError(
        "Lütfen alışkanlığı neden yapamadığını seç."
      );
      return false;
    }

    return true;
  };

  const buildCheckInNote = () => {
    if (status === "done") {
      return note;
    }

    const reasonLabels = {
      tired: "Yorgundum",
      time: "Zaman bulamadım",
      forgot: "Unuttum",
      motivation: "Motivasyonum yoktu",
      difficult: "Çok zor geldi",
      other: "Başka bir neden",
    };

    return [
      `Neden: ${reasonLabels[failureReason]}`,
      reasonDetail
        ? `Açıklama: ${reasonDetail}`
        : "",
      note ? `Ek not: ${note}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setApiError("");

      const createdCheckIn = await createCheckIn({
        habit_id: id,
        check_date: new Date()
          .toISOString()
          .split("T")[0],
        status,
        mood_score: Number(moodScore),
        note: buildCheckInNote(),
      });

      navigate(`/recommendation/${id}`, {
        state: {
          checkInId: createdCheckIn?.id,
          habit,
          status,
          moodScore: Number(moodScore),
          failureReason,
          reasonDetail,
          note,
        },
      });
    } catch (error) {
      const backendMessage = error.response?.data?.detail;

      if (
        backendMessage ===
        "Mood score is only saved for done habits"
      ) {
        setApiError(
          "Backend henüz Yapmadım durumunda ruh hâli puanını kabul etmiyor."
        );
      } else {
        setApiError(
          backendMessage ||
            "Check-in kaydedilirken bir hata oluştu."
        );
      }
    } finally {
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
          Bugün <strong>{habit.title}</strong>{" "}
          alışkanlığını gerçekleştirdin mi?
        </p>

        {apiError && (
          <div className="checkin-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkin-options">
            <button
              type="button"
              className={
                status === "done"
                  ? "status-button done active"
                  : "status-button done"
              }
              onClick={() =>
                handleStatusChange("done")
              }
            >
              <span>✅</span>
              <strong>Yaptım</strong>
              <small>
                Bugünkü hedefimi tamamladım.
              </small>
            </button>

            <button
              type="button"
              className={
                status === "missed"
                  ? "status-button missed active"
                  : "status-button missed"
              }
              onClick={() =>
                handleStatusChange("missed")
              }
            >
              <span>❌</span>
              <strong>Yapmadım</strong>
              <small>
                Bugün hedefimi tamamlayamadım.
              </small>
            </button>
          </div>

          <MoodRating
            value={moodScore}
            onChange={setMoodScore}
          />

          {status === "missed" && (
            <FailureReasonForm
              selectedReason={failureReason}
              reasonDetail={reasonDetail}
              onReasonChange={setFailureReason}
              onReasonDetailChange={setReasonDetail}
            />
          )}

          <div className="checkin-note-section">
            <label htmlFor="checkInNote">
              {status === "done"
                ? "Bugün neyin iyi gitmesini sağladı?"
                : "Eklemek istediğin başka bir not var mı?"}
            </label>

            <textarea
              id="checkInNote"
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              placeholder={
                status === "done"
                  ? "Örn: Sabah erken başladığım için daha kolay oldu."
                  : "Bugünkü deneyimini biraz daha anlatabilirsin."
              }
              maxLength={500}
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Check-in Kaydediliyor..."
              : "Check-in'i Kaydet ve Öneriyi Gör"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default CheckIn;