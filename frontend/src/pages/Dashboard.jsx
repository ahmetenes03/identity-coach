import { Link } from "react-router-dom";
import { FaPlus, FaCheckCircle, FaChartLine, FaBrain } from "react-icons/fa";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>Identity Coach</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/habit/create">Yeni Alışkanlık</Link>
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

        <section className="stats-grid">
          <div className="stat-card">
            <FaCheckCircle />
            <h3>0</h3>
            <p>Tamamlanan Alışkanlık</p>
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
            <p>Henüz alışkanlık eklemedin.</p>
          </div>

          <div className="empty-state">
            <FaBrain />
            <h3>İlk alışkanlığını oluştur</h3>
            <p>
              Identity Coach, alışkanlıklarını kimlik temelli hedeflerle
              takip etmene yardımcı olur.
            </p>

            <Link to="/habit/create" className="empty-button">
              Alışkanlık Oluştur
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;