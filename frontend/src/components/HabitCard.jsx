import { Link } from "react-router-dom";
import { FaClock, FaEdit, FaTrash, FaUserCheck, FaCheck } from "react-icons/fa";

function HabitCard({ habit, latestCheckIn, onDelete }) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Bu alışkanlığı silmek istediğine emin misin?"
    );

    if (confirmDelete) {
      onDelete(habit.id);
    }
  };

  return (
    <div className="habit-item-card">
      <div className="habit-content">
        <h3>{habit.title}</h3>
        <p>{habit.goal_text}</p>

        <div className="habit-meta">
          <span>
            <FaUserCheck /> {habit.identity_text}
          </span>

          <span>
            <FaClock /> {habit.frequency === "daily" ? "Günlük" : "Haftalık"}
          </span>

          <span>{getTimeLabel(habit.preferred_time)}</span>
        </div>

        {latestCheckIn && (
          <div className="checkin-result">
            <strong>Son Check-in:</strong>{" "}
            {latestCheckIn.status === "done" ? "✅ Yaptım" : "❌ Yapmadım"}
            {latestCheckIn.mood_score && (
              <p>Ruh hali puanı: {latestCheckIn.mood_score}/10</p>
            )}
            {latestCheckIn.note && <p>Not: {latestCheckIn.note}</p>}
          </div>
        )}
      </div>

      <div className="habit-actions">
        <Link to={`/check-in/${habit.id}`} className="check-button">
          <FaCheck />
        </Link>

        <Link to={`/habit/edit/${habit.id}`} className="edit-button">
          <FaEdit />
        </Link>

        <button className="delete-button" onClick={handleDelete}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

function getTimeLabel(time) {
  const labels = {
    morning: "🌞 Sabah",
    noon: "☀️ Öğlen",
    evening: "🌙 Akşam",
    anytime: "✨ Fark etmez",
  };

  return labels[time] || time;
}

export default HabitCard;