# Identity Coach API Dokümantasyonu

Bu belgede uygulamanın sunduğu tüm API uç noktaları (endpoints), kabul ettiği parametreler ve gerçekleştirdiği işlevler listelenmiştir.

---

## 1. Kimlik Doğrulama API'leri (Authentication)
Kullanıcı kayıt ve oturum açma işlemlerini yönetir. JWT (JSON Web Token) tabanlı kimlik doğrulaması kullanır.

*   ### `POST /api/auth/register`
    *   **Ne Yapar?** Sisteme yeni bir kullanıcı kaydeder.
    *   **Parametreler (JSON):** `name`, `email`, `password`.
    *   **Özellik:** Şifreyi güvenli bir şekilde `bcrypt` ile hash'leyerek veritabanına kaydeder ve kullanıcıya doğrudan bir `access_token` döner.
    
*   ### `POST /api/auth/login`
    *   **Ne Yapar?** Mevcut kullanıcının giriş yapmasını sağlar.
    *   **Parametreler (JSON):** `email`, `password`.
    *   **Yanıt:** Giriş başarılı ise JWT `access_token` ve `token_type` döner.

---

## 2. Alışkanlık API'leri (Habits)
Kullanıcının takip etmek istediği kimlik temelli alışkanlıkların yönetimini (CRUD) sağlar.

*   ### `GET /api/habits`
    *   **Ne Yapar?** Oturum açmış kullanıcının tüm alışkanlıklarını listeler (en yeniden eskiye).
    
*   ### `POST /api/habits`
    *   **Ne Yapar?** Yeni bir alışkanlık oluşturur.
    *   **Parametreler (JSON):** `title`, `goal_text`, `frequency`, `preferred_time`, `identity_text`.
    *   **İş Kuralı:** Bir kullanıcı aynı anda **en fazla 3 aktif** alışkanlık takip edebilir.

*   ### `PATCH /api/habits/{habit_id}`
    *   **Ne Yapar?** Belirtilen alışkanlığı günceller (başlık, sıklık, aktiflik durumu vb.).
    *   **Güvenlik:** Yalnızca alışkanlığın sahibi olan kullanıcı bu işlemi gerçekleştirebilir.

*   ### `DELETE /api/habits/{habit_id}`
    *   **Ne Yapar?** Belirtilen alışkanlığı ve ona bağlı tüm check-in geçmişini veritabanından siler.

---

## 3. Günlük Kayıt API'leri (Check-Ins)
Kullanıcının alışkanlıklarını günlük olarak tamamlayıp tamamlamadığını takip eder.

*   ### `POST /api/check-ins`
    *   **Ne Yapar?** Günlük alışkanlık durumunu (yapıldı/yapılmadı) kaydeder.
    *   **Parametreler (JSON):** `habit_id`, `check_date`, `status` ("done" veya "missed"), `mood_score` (opsiyonel), `note` (opsiyonel).
    *   **İş Kuralı:** 
        *   Bir alışkanlık için aynı güne yalnızca 1 check-in girilebilir.
        *   `mood_score` (ruh hali puanı) yalnızca **1 ile 10** arasında olabilir ve sadece alışkanlık tamamlandığında (`status` = "done") kaydedilebilir.

*   ### `GET /api/check-ins`
    *   **Ne Yapar?** Kullanıcının check-in kayıt geçmişini listeler. `habit_id` parametresi ile belirli bir alışkanlığa göre filtrelenebilir.

---

## 4. Yapay Zekâ Koçluk API'leri (AI Coach)
Kullanıcı alışkanlık kaçırdığında devreye giren analiz ve koçluk mekanizmasını yönetir.

*   ### `POST /api/coach/reflect`
    *   **Ne Yapar?** Kullanıcı bir alışkanlığı gerçekleştiremediğinde (kaçırdığında) girilen mazeret metnini (`reason_text`) kaydeder ve AI koçtan kişiselleştirilmiş empati ve strateji içeren bir yanıt üretir.
    *   **Parametreler (JSON):** `habit_id`, `reason_text` (min 3 karakter), `check_in_id` (opsiyonel).
    *   **İş Mantığı:**
        1. Cevabı alır, mazereti kategorize eder (`time`, `energy`, `forgetting` vb.).
        2. Kullanıcının geçmiş serisini (`streak`) ve en sık karşılaştığı mazeret örüntülerini (`top_pattern`) çeker.
        3. RAG yapısı ile veritabanından mazerete en uygun bilimsel gelişim stratejilerini bulur.
        4. Kişiye özel, yargılamayan, kimliği destekleyici 2-4 cümlelik empati mesajı ve somut bir sonraki adım önerisi üretir.

*   ### `GET /api/coach/strategies`
    *   **Ne Yapar?** Sistemde kayıtlı olan tüm bilimsel davranış stratejilerini listeler (RAG embedding'leri gizlenerek).

---

## 5. İstatistik ve Analitik API'leri (Stats)
Kullanıcının ilerlemesini ve mazeret örüntülerini görselleştirmek için veriler sağlar.

*   ### `GET /api/stats/overview`
    *   **Ne Yapar?** Toplam check-in, tamamlanan/kaçırılan check-in sayıları ve genel alışkanlık tamamlanma oranını döner.
    
*   ### `GET /api/stats/weekly`
    *   **Ne Yapar?** Son 7 güne ait günlük tamamlanan ve kaçırılan alışkanlık sayılarını döner (haftalık grafikler için kullanılır).
    
*   ### `GET /api/stats/excuses`
    *   **Ne Yapar?** Kullanıcının şimdiye kadar bildirdiği mazeretlerin kategorisel dağılımını ve adetlerini döner. (Örn: En çok "Zaman" veya "Enerji" kaynaklı mı aksatıldığını gösterir).
