const failureReasons = [
  {
    value: "tired",
    icon: "😴",
    title: "Yorgundum",
    description: "Enerjim alışkanlığı tamamlamak için yeterli değildi.",
  },
  {
    value: "time",
    icon: "⏰",
    title: "Zaman bulamadım",
    description: "Günlük programımda alışkanlığıma yer kalmadı.",
  },
  {
    value: "forgot",
    icon: "🧠",
    title: "Unuttum",
    description: "Alışkanlığı hatırlatacak bir tetikleyicim yoktu.",
  },
  {
    value: "motivation",
    icon: "📉",
    title: "Motivasyonum yoktu",
    description: "Başlamak için yeterli istek hissedemedim.",
  },
  {
    value: "difficult",
    icon: "🧩",
    title: "Çok zor geldi",
    description: "Hedef o an için fazla büyük veya karmaşıktı.",
  },
  {
    value: "other",
    icon: "💬",
    title: "Başka bir neden",
    description: "Nedenimi kendi cümlelerimle açıklamak istiyorum.",
  },
];

function FailureReasonForm({
  selectedReason,
  reasonDetail,
  onReasonChange,
  onReasonDetailChange,
}) {
  return (
    <section className="failure-reason-section">
      <div className="failure-heading">
        <span className="failure-heading-icon">💭</span>

        <div>
          <h3>Neden yapamadın?</h3>
          <p>
            Seni yargılamak için değil, daha uygun bir strateji önerebilmek
            için soruyoruz.
          </p>
        </div>
      </div>

      <div className="failure-reason-grid">
        {failureReasons.map((reason) => (
          <button
            key={reason.value}
            type="button"
            className={
              selectedReason === reason.value
                ? "reason-option active"
                : "reason-option"
            }
            onClick={() => onReasonChange(reason.value)}
          >
            <span className="reason-icon">{reason.icon}</span>

            <span className="reason-content">
              <strong>{reason.title}</strong>
              <small>{reason.description}</small>
            </span>
          </button>
        ))}
      </div>

      {selectedReason && (
        <div className="reason-detail">
          <label htmlFor="reasonDetail">
            Biraz daha açıklamak ister misin?
          </label>

          <textarea
            id="reasonDetail"
            value={reasonDetail}
            onChange={(event) =>
              onReasonDetailChange(event.target.value)
            }
            placeholder="Örn: İşten geç çıktım ve eve geldiğimde çok yorgundum."
            maxLength={500}
          />

          <span className="character-count">
            {reasonDetail.length}/500
          </span>
        </div>
      )}
    </section>
  );
}

export default FailureReasonForm;