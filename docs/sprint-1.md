# Sprint 1 Planı

## Sprint Hedefi

Kullanıcıların sisteme kayıt olup giriş yapabildiği, alışkanlık oluşturabildiği ve günlük check-in yapabildiği temel uygulama altyapısını tamamlamak.

## Jira Kapsamı

Sprint 1 ana işleri:

- G9-1 Kullanıcı Kaydı
- G9-2 Kullanıcı Girişi
- G9-3 Alışkanlık Oluşturma
- G9-4 Alışkanlık Düzenleme
- G9-5 Alışkanlık Silme
- G9-6 Günlük Check-in

## Elif'e Atanan Backend / Veritabanı Görevleri

- G9-25 Kullanıcı veritabanı tablosunu oluştur
- G9-26 Backend'de kayıt API'sini oluştur
- G9-27 Şifreyi güvenli şekilde hash'leyerek veritabanına kaydet
- G9-30 Login API'sini geliştir
- G9-31 Kimlik doğrulama mekanizmasını kur
- G9-37 Habit veritabanı tablosunu oluştur
- G9-38 Habit oluşturma API'sini geliştir
- G9-39 Habit verisini kullanıcı hesabı ile ilişkilendir
- G9-42 Habit güncelleme API'sini geliştir
- G9-45 Habit silme API'sini geliştir
- G9-49 Check-in API'sini yaz
- G9-50 Günlük log tablosunu oluştur
- G9-51 Günlük kayıtları veritabanına kaydet

## Tamamlanan Teknik Çıktılar

- FastAPI backend iskeleti
- User, Habit, CheckIn, Strategy ve UserStatistic modelleri
- Register ve login API'leri
- bcrypt password hash
- JWT access token üretimi ve doğrulama
- Kullanıcıya bağlı habit CRUD API'leri
- Günlük check-in kayıt API'si
- Lokal SQLite, PostgreSQL/Supabase uyumlu `DATABASE_URL` desteği
- Supabase Security Advisor için uygulama tablolarında Row Level Security migration'ı

## API Test Akışı

1. Kullanıcı oluştur: `POST /api/auth/register`
2. Token al: register yanıtındaki `access_token` veya `POST /api/auth/login`
3. Habit oluştur: `POST /api/habits`
4. Habit listele: `GET /api/habits`
5. Check-in oluştur: `POST /api/check-ins`
6. Check-in listele: `GET /api/check-ins`

## Sonraki Sprintlere Bırakılanlar

- Başarısızlık sebebi toplama
- AI agent akışı
- RAG strateji havuzu
- Dashboard analitikleri
- Haftalık rapor
