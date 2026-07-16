const recommendations = {
  completed: {
    title: "Başarını pekiştir",
    strategyName: "Olumlu Pekiştirme",
    source: "Davranış Bilimi",
    summary:
      "Bugün işe yarayan koşulları fark ederek aynı davranışı yeniden gerçekleştirme ihtimalini artırabilirsin.",
    steps: [
      "Bugün alışkanlığı tamamlamanı kolaylaştıran koşulu belirle.",
      "Yarın aynı zaman veya ortamı yeniden oluşturmaya çalış.",
      "Tamamladığın davranışı küçük bir şekilde kutla.",
    ],
    example:
      "Bugün sabah erken başladığın için başarılı olduysan yarın aynı saatte başlamayı planla.",
    identityMessage:
      "Her tamamlanan tekrar, olmak istediğin kişi lehine verilen yeni bir oydur.",
  },

  tired: {
    title: "Alışkanlığı küçült",
    strategyName: "İki Dakika Kuralı",
    source: "Atomic Habits",
    summary:
      "Enerjinin düşük olduğu günlerde alışkanlığı tamamen bırakmak yerine en küçük uygulanabilir hâline indirebilirsin.",
    steps: [
      "Alışkanlığının iki dakikada yapılabilecek sürümünü belirle.",
      "Yorgun olduğunda yalnızca bu küçük sürümü uygula.",
      "Enerjin kalırsa devam et; kalmazsa küçük tamamlamayı başarı kabul et.",
    ],
    example:
      "20 dakika kitap okumak yerine yalnızca bir sayfa oku.",
    identityMessage:
      "Küçük bir adım bile kimliğinle kurduğun bağı korur.",
  },

  time: {
    title: "Takviminde gerçek bir alan oluştur",
    strategyName: "Zaman Bloklama",
    source: "Davranış Tasarımı",
    summary:
      "Alışkanlığını boş zaman kalınca yapılacak bir görev değil, önceden planlanan kısa bir randevu olarak ele al.",
    steps: [
      "Yarın için kesin bir başlangıç saati belirle.",
      "Takviminde 10–15 dakikalık bir alan ayır.",
      "Bu zaman diliminde başka bir işle ilgilenmemeye çalış.",
    ],
    example:
      "Kitap okuyacağım yerine, yarın 20.30–20.40 arasında beş sayfa okuyacağım de.",
    identityMessage:
      "Planlanan davranışları başlatmak, yalnızca niyet edilen davranışları başlatmaktan daha kolaydır.",
  },

  forgot: {
    title: "Görünür bir tetikleyici oluştur",
    strategyName: "Alışkanlık İstifleme",
    source: "Atomic Habits",
    summary:
      "Yeni alışkanlığını her gün zaten yaptığın mevcut bir davranışın hemen arkasına bağla.",
    steps: [
      "Her gün mutlaka yaptığın bir davranışı seç.",
      "Yeni alışkanlığını bu davranıştan hemen sonra uygula.",
      "Görsel bir hatırlatıcıyı görünür bir yere bırak.",
    ],
    example:
      "Akşam çayımı hazırladıktan sonra masaya oturup bir sayfa kitap okuyacağım.",
    identityMessage:
      "Doğru tetikleyici, hatırlamak için irade kullanma ihtiyacını azaltır.",
  },

  motivation: {
    title: "Başlama eşiğini düşür",
    strategyName: "Minimum Uygulanabilir Alışkanlık",
    source: "Tiny Habits",
    summary:
      "Motivasyon beklemek yerine alışkanlığa başlamak için gereken çabayı azalt.",
    steps: [
      "Hedefinin en küçük uygulanabilir sürümünü seç.",
      "Yalnızca başlamaya odaklan.",
      "Küçük tamamlamayı hemen fark et ve kutla.",
    ],
    example:
      "30 dakika egzersiz yerine spor kıyafetini giyip yalnızca bir hareket yap.",
    identityMessage:
      "Motivasyon değişkendir; kolay başlayan sistemler daha güvenilirdir.",
  },

  difficult: {
    title: "Hedefi daha küçük parçalara ayır",
    strategyName: "Kademeli İlerleme",
    source: "Davranış Bilimi",
    summary:
      "Zor gelen davranışı tek seferde tamamlamak yerine küçük ve ölçülebilir aşamalara ayır.",
    steps: [
      "Hedefin en zor bölümünü belirle.",
      "Bu bölümü üç küçük adıma ayır.",
      "Bugün yalnızca ilk adımı tamamla.",
    ],
    example:
      "Bir bölüm çalışmak yerine yalnızca konunun ilk iki sayfasını oku.",
    identityMessage:
      "Sürdürülebilir ilerleme, büyük fakat düzensiz çabalardan daha değerlidir.",
  },

  other: {
    title: "Engeli görünür hâle getir",
    strategyName: "Engel Analizi",
    source: "Davranış Tasarımı",
    summary:
      "Alışkanlığın önündeki gerçek engeli tanımlayıp bir sonraki deneme için tek bir değişiklik seç.",
    steps: [
      "Bugünkü engeli tek cümleyle tanımla.",
      "Kontrol edebileceğin kısmı belirle.",
      "Bir sonraki denemede uygulayacağın tek değişikliği seç.",
    ],
    example:
      "Ortam uygun değilse yarın alışkanlığın için daha sakin bir yer belirle.",
    identityMessage:
      "Başarısızlık kimliğini değil, sisteminde geliştirilebilecek bir alanı gösterir.",
  },
};

export const getRecommendationPreview = ({
  status,
  failureReason,
  habit,
  moodScore,
  reasonDetail,
}) => {
  const key =
    status === "done"
      ? "completed"
      : failureReason && recommendations[failureReason]
        ? failureReason
        : "other";

  return {
    ...recommendations[key],
    habitTitle: habit?.title || "Alışkanlığın",
    identityText: habit?.identity_text || "",
    status,
    moodScore,
    failureReason,
    reasonDetail,
  };
};

/*
Backend endpoint hazır olduğunda yalnızca bu fonksiyonu
API isteğine dönüştüreceğiz.

Örnek:

import api from "./api";

export const getRecommendation = async (payload) => {
  const response = await api.post(
    "/api/recommendations",
    payload
  );

  return {
    title: response.data.title,
    strategyName: response.data.strategy_name,
    source: response.data.source,
    summary: response.data.content,
    steps: response.data.steps,
    example: response.data.example_advice,
    identityMessage: response.data.identity_message,
  };
};
*/