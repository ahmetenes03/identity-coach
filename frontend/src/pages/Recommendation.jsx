import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import RecommendationCard from "../components/RecommendationCard";
import { getRecommendation } from "../services/recommendationService";
import { getApiErrorMessage } from "../services/api";
import "../styles/recommendation.css";

function Recommendation() {
  const location = useLocation();
  const checkInData = location.state;

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // StrictMode (dev) effect'i iki kez çağırır; koç isteği yan etkili olduğu
  // için (reflection kaydı oluşturur) yalnızca bir kez çalışmasını garanti et.
  const startedRef = useRef(false);

  useEffect(() => {
    // startedRef, StrictMode'un (dev) çifte çağrısında koçun yalnızca bir kez
    // çalışmasını garanti eder; bu yüzden ayrıca bir "ignore" bayrağı yok
    // (ikisi birlikte sonucun atılmasına yol açıyordu).
    if (!checkInData || startedRef.current) return;
    startedRef.current = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getRecommendation(checkInData);
        setRecommendation(result);
      } catch (err) {
        setError(getApiErrorMessage(err, "Öneri alınamadı. Lütfen tekrar dene."));
      } finally {
        setLoading(false);
      }
    };

    load();
    // checkInData location.state'ten gelir ve mount boyunca sabittir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checkInData) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="recommendation-page">
      <div className="recommendation-container">
        <header className="recommendation-header">
          <div className="recommendation-header-icon">🤖</div>
          <p className="recommendation-eyebrow">Identity Coach</p>
          <h1>Kişisel Koçluk Önerin</h1>
          <p>
            Check-in yanıtlarına göre bir sonraki adımını kolaylaştıracak bir
            strateji hazırlandı.
          </p>
        </header>

        <section className="recommendation-context">
          <div>
            <span>Alışkanlık</span>
            <strong>{checkInData.habit?.title || "Alışkanlık"}</strong>
          </div>

          <div>
            <span>Bugünkü durum</span>
            <strong>
              {checkInData.status === "done" ? "✅ Yaptım" : "❌ Yapmadım"}
            </strong>
          </div>

          {checkInData.status === "done" && (
            <div>
              <span>Ruh hâli</span>
              <strong>{checkInData.moodScore}/10</strong>
            </div>
          )}
        </section>

        {loading && (
          <div className="recommendation-loading">
            <span className="recommendation-spinner" aria-hidden="true" />
            <p>Koçun senin için en uygun stratejiyi hazırlıyor...</p>
          </div>
        )}

        {!loading && error && (
          <div className="recommendation-error">
            <p>{error}</p>
            <Link to="/dashboard" className="recommendation-action">
              Dashboard'a dön
            </Link>
          </div>
        )}

        {!loading && !error && recommendation && (
          <RecommendationCard recommendation={recommendation} />
        )}
      </div>
    </main>
  );
}

export default Recommendation;
