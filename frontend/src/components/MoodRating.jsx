const moodLabels = {
  1: "Çok kötü",
  2: "Çok kötü",
  3: "Kötü",
  4: "Biraz kötü",
  5: "Normal",
  6: "İyi",
  7: "İyi",
  8: "Çok iyi",
  9: "Harika",
  10: "Mükemmel",
};

function MoodRating({ value, onChange }) {
  return (
    <section className="mood-rating">
      <div className="mood-rating-header">
        <div>
          <h3>Bugün nasıl hissediyorsun?</h3>
          <p>Ruh hâlini 1 ile 10 arasında değerlendir.</p>
        </div>

        <div className="selected-mood">
          <strong>{value}/10</strong>
          <span>{moodLabels[value]}</span>
        </div>
      </div>

      <div className="mood-scale">
        {Array.from({ length: 10 }, (_, index) => index + 1).map(
          (score) => (
            <button
              key={score}
              type="button"
              className={
                value === score
                  ? "mood-score-button active"
                  : "mood-score-button"
              }
              onClick={() => onChange(score)}
              aria-label={`Ruh hâli puanı ${score}`}
            >
              {score}
            </button>
          )
        )}
      </div>

      <div className="mood-scale-labels">
        <span>Çok kötü</span>
        <span>Mükemmel</span>
      </div>
    </section>
  );
}

export default MoodRating;