import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaCheckCircle,
  FaChartLine,
  FaBrain,
  FaSignOutAlt,
  FaListUl,
} from "react-icons/fa";
import HabitCard from "../components/HabitCard";
import WeeklyChart from "../components/WeeklyChart";
import { deleteHabit, getCheckIns, getHabits } from "../services/habitService";
import { getOverview, getWeekly } from "../services/statsService";
import { getStoredName, logoutUser } from "../services/authService";
import { getApiErrorMessage } from "../services/api";
import { todayLocal } from "../utils/date";
import "../styles/dashboard.css";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [overview, setOverview] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  // Silme sonrası yeniden yükleme bu sayacı artırarak tetiklenir.
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const userName = getStoredName();

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const [habitsData, checkInsData, overviewData, weeklyData] =
          await Promise.all([
            getHabits(),
            getCheckIns(),
            getOverview(),
            getWeekly(todayLocal()),
          ]);
        if (ignore) return;

        setHabits(habitsData);
        setCheckIns(checkInsData);
        setOverview(overviewData);
        setWeekly(weeklyData);
        setApiError("");
      } catch (error) {
        if (!ignore) {
          setApiError(
            getApiErrorMessage(error, "Veriler yüklenirken hata oluştu.")
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabit(habitId);
      toast.success("Alışkanlık silindi.");
      setRefreshKey((key) => key + 1);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Silme işlemi sırasında hata oluştu.")
      );
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // API en yeni check-in'i ilk sırada döndürür (check_date desc).
  const getLatestCheckIn = (habitId) =>
    checkIns.find((checkIn) => checkIn.habit_id === habitId) || null;

  const successRate = overview ? Math.round(overview.completion_rate * 100) : 0;

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <h2>
          <FaBrain /> Identity Coach
        </h2>

        <nav>
          <NavLink to="/dashboard">
            <FaListUl /> Dashboard
          </NavLink>
          <NavLink to="/habit/create">
            <FaPlus /> Yeni Alışkanlık
          </NavLink>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Çıkış Yap
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Hoş geldin{userName ? `, ${userName.split(" ")[0]}` : ""} 👋</h1>
            <p>Bugün attığın her küçük adım, kimliğine verilmiş bir oy.</p>
          </div>

          <Link to="/habit/create" className="add-habit-button">
            <FaPlus />
            Yeni Alışkanlık
          </Link>
        </header>

        {apiError && <div className="error">{apiError}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon brand">
              <FaListUl />
            </div>
            <h3>
              {overview ? overview.active_habit_count : "–"}
              <span className="stat-sub">/ 3</span>
            </h3>
            <p>Aktif Alışkanlık</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <FaChartLine />
            </div>
            <h3>%{successRate}</h3>
            <p>Başarı Oranı</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon violet">
              <FaCheckCircle />
            </div>
            <h3>{overview ? overview.total_check_ins : "–"}</h3>
            <p>Toplam Check-in</p>
          </div>
        </section>

        <section className="chart-card">
          <WeeklyChart days={weekly} />
        </section>

        <section className="habit-section">
          <div className="section-header">
            <h2>Alışkanlıklarım</h2>
            <p>Kimlik temelli alışkanlıklarını buradan takip edebilirsin.</p>
          </div>

          {loading ? (
            <p className="loading-text">Alışkanlıklar yükleniyor...</p>
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
