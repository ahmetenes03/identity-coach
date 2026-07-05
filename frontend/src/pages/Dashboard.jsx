import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaCheckCircle, FaChartLine, FaBrain } from "react-icons/fa";
import HabitCard from "../components/HabitCard";
import { deleteHabit, getCheckIns, getHabits } from "../services/habitService";
import { logoutUser } from "../services/authService";
import "../styles/dashboard.css";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const habitsData = await getHabits();
      const checkInsData = await getCheckIns();

      setHabits(habitsData);
      setCheckIns(checkInsData);
    } catch (error) {
      setApiError(
        error.response?.data?.detail || "Veriler yüklenirken hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabit(habitId);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.detail || "Silme işlemi sırasında hata oluştu.");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const getLatestCheckIn = (habitId) => {
    const habitCheckIns = checkIns.filter(
      (checkIn) => checkIn.habit_id === habitId
    );

    if (habitCheckIns.length === 0) return null;

    return habitCheckIns[habitCheckIns.length - 1];
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <h2>Identity Coach</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/habit/create">Yeni Alışkanlık</Link>
          <button className="logout-button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Hoş geldin 👋</h1>
            <p>Bugünkü alışkanlıklarını takip etmeye başlayabilirsin.</p>
          </div>

          <Link to="/habit/create" className="add-habit-button">
            <FaPlus />
            Yeni Alışkanlık
          </Link>
        </header>

        {apiError && <div className="error">{apiError}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <FaCheckCircle />
            <h3>{habits.length}</h3>
            <p>Toplam Alışkanlık</p>
          </div>

          <div className="stat-card">
            <FaChartLine />
            <h3>0%</h3>
            <p>Başarı Oranı</p>
          </div>

          <div className="stat-card">
            <FaBrain />
            <h3>AI</h3>
            <p>Koçluk Hazır</p>
          </div>
        </section>

        <section className="habit-section">
          <div className="section-header">
            <h2>Alışkanlıklarım</h2>
            <p>Kimlik temelli alışkanlıklarını buradan takip edebilirsin.</p>
          </div>

          {loading ? (
            <p>Alışkanlıklar yükleniyor...</p>
          ) : habits.length === 0 ? (
            <div className="empty-state">
              <FaBrain />
              <h3>İlk alışkanlığını oluştur</h3>
              <p>
                Identity Coach, alışkanlıklarını kimlik temelli hedeflerle takip
                etmene yardımcı olur.
              </p>

              <Link to="/habit/create" className="empty-button">
                Alışkanlık Oluştur
              </Link>
            </div>
          ) : (
            <div className="habit-list">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  latestCheckIn={getLatestCheckIn(habit.id)}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;