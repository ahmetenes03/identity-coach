import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaLightbulb,
  FaListOl,
} from "react-icons/fa";

function RecommendationCard({ recommendation }) {
  return (
    <article className="recommendation-card">
      <div className="recommendation-badge">
        <FaLightbulb />
        Sana özel strateji
      </div>

      <h2>{recommendation.title}</h2>

      <p className="recommendation-summary">
        {recommendation.summary}
      </p>

      <div className="strategy-information">
        <div>
          <span>Önerilen strateji</span>
          <strong>{recommendation.strategyName}</strong>
        </div>

        <div>
          <span>Kaynak yaklaşım</span>
          <strong>{recommendation.source}</strong>
        </div>
      </div>

      <section className="strategy-steps">
        <div className="strategy-section-title">
          <FaListOl />
          <h3>Bir sonraki denemende uygula</h3>
        </div>

        <ol>
          {recommendation.steps.map((step, index) => (
            <li key={`${step}-${index}`}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="strategy-example">
        <div className="strategy-section-title">
          <FaBookOpen />
          <h3>Örnek uygulama</h3>
        </div>

        <p>{recommendation.example}</p>
      </section>

      <section className="identity-reminder">
        <span>🌱</span>

        <div>
          <strong>Kimlik hatırlatıcısı</strong>
          <p>{recommendation.identityMessage}</p>

          {recommendation.identityText && (
            <blockquote>
              “{recommendation.identityText}”
            </blockquote>
          )}
        </div>
      </section>

      <Link to="/dashboard" className="recommendation-action">
        Dashboard’a dön
        <FaArrowRight />
      </Link>
    </article>
  );
}

export default RecommendationCard;