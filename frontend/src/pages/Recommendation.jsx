import { Navigate, useLocation } from "react-router-dom";
import RecommendationCard from "../components/RecommendationCard";
import { getRecommendationPreview } from "../services/recommendationService";
import "../styles/recommendation.css";

function Recommendation() {
  const location = useLocation();
  const checkInData = location.state;

  if (!checkInData) {
    return <Navigate to="/dashboard" replace />;
  }

  const recommendation =
    getRecommendationPreview(checkInData);

  return (
    <main className="recommendation-page">
      <div className="recommendation-container">
        <header className="recommendation-header">
          <div className="recommendation-header-icon">
            🤖
          </div>

          <p className="recommendation-eyebrow">
            Identity Coach
          </p>

          <h1>Kişisel Koçluk Önerin Hazır</h1>

          <p>
            Check-in yanıtlarına göre bir sonraki adımını
            kolaylaştıracak bir strateji hazırlandı.
          </p>
        </header>

        <section className="recommendation-context">
          <div>
            <span>Alışkanlık</span>
            <strong>
              {checkInData.habit?.title || "Alışkanlık"}
            </strong>
          </div>

          <div>
            <span>Bugünkü durum</span>
            <strong>
              {checkInData.status === "done"
                ? "✅ Yaptım"
                : "❌ Yapmadım"}
            </strong>
          </div>

          <div>
            <span>Ruh hâli</span>
            <strong>{checkInData.moodScore}/10</strong>
          </div>
        </section>

        <RecommendationCard
          recommendation={recommendation}
        />
      </div>
    </main>
  );
}

export default Recommendation;