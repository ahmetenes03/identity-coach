import { reflectOnFailure } from "./coachService";

// Kaçırma sebebi seçeneklerinin (FailureReasonForm) serbest-metin karşılığı.
// Bu metin koça reason_text olarak gider; koç kendi kategorisini üretir.
const REASON_LABELS = {
  tired: "Yorgundum, enerjim yoktu",
  time: "Zaman bulamadım, çok yoğundum",
  forgot: "Unuttum, aklımdan çıktı",
  motivation: "Motivasyonum yoktu, canım istemedi",
  difficult: "Çok zor geldi, gözümde büyüdü",
  other: "Başka bir neden",
};

// "done" durumunda koç akışı çalışmaz (koç başarısızlık içindir); başarıyı
// pekiştiren sabit bir olumlu kart gösterilir.
const buildDoneRecommendation = (habit) => ({
  category_label: "Başarı",
  title: "Başarını pekiştir",
  summary:
    "Bugün işe yarayan koşulları fark ederek aynı davranışı yarın da tekrarlama ihtimalini artırabilirsin.",
  strategyName: "Olumlu Pekiştirme",
  source: "Davranış Bilimi",
  steps: [
    "Bugün alışkanlığı tamamlamanı kolaylaştıran koşulu belirle.",
    "Yarın aynı zamanı veya ortamı yeniden oluşturmaya çalış.",
    "Tamamladığın davranışı küçük bir şekilde kutla.",
  ],
  example:
    "Sabah erken başladığın için başarılı olduysan yarın da aynı saatte başlamayı planla.",
  identityMessage:
    "Her tamamlanan tekrar, olmak istediğin kişi lehine verilen yeni bir oydur.",
  identityText: habit?.identity_text || "",
  habitTitle: habit?.title || "Alışkanlığın",
});

/**
 * Check-in sonrası öneriyi getirir.
 * - status "done"  → istemci tarafı olumlu kart
 * - status "missed" → gerçek /api/coach/reflect (RAG + LLM) sonucunu karta çevirir
 */
export const getRecommendation = async ({
  status,
  failureReason,
  reasonDetail,
  habit,
  checkInId,
}) => {
  if (status === "done") {
    return buildDoneRecommendation(habit);
  }

  const label = REASON_LABELS[failureReason] || "Belirtilmemiş bir neden";
  const reasonText = reasonDetail?.trim()
    ? `${label}. ${reasonDetail.trim()}`
    : label;

  const coach = await reflectOnFailure({
    habit_id: habit.id,
    reason_text: reasonText,
    check_in_id: checkInId || undefined,
  });

  const strategies = coach.strategies || [];
  const top = strategies[0] || {};

  return {
    category_label: coach.category_label,
    // Koçun kişiselleştirilmiş mesajı kartın ana metni olur.
    title: top.title || "Sana özel öneri",
    summary: coach.message,
    strategyName: top.title || coach.category_label,
    source: top.source || "Davranış Bilimi",
    // Getirilen stratejiler "sonraki adımlar" olarak listelenir.
    steps: strategies.map((s) => `${s.title}: ${s.content}`),
    example: top.example_advice || "",
    identityMessage:
      coach.streak > 0
        ? `${coach.streak} günlük serin hâlâ ayakta; bir aksama onu silmez.`
        : "Bir aksama, olmak istediğin kişiyi tanımlamaz — yarın küçük bir adımla geri dön.",
    identityText: habit?.identity_text || "",
    habitTitle: habit?.title || "Alışkanlığın",
    provider: coach.provider,
  };
};
