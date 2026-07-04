# identity-coach
AI Agent Tabanlı Alışkanlık Takibi Uygulaması

## Proje Hakkında

Identity Coach, kullanıcıların alışkanlıklarını takip eden ve başarısızlık anında devreye girerek onları motive eden bir dijital koçtur. Kullanıcı hedefini belirler, akşam yapıp yapmadığını işaretler. Eğer yapmadıysa, yapay zeka nedenini sorar, geçmiş başarısızlıklarını analiz eder ve bilimsel stratejilerle tekrar yola sokar.

## Değer Önerisi

Sadece "yaptın/yapmadın" demez. Başarısızlık anında müdahale eder, kişiye özel çözüm sunar. Kimlik değişimini merkeze alarak kalıcı davranış değişikliği sağlar.

## Hedef Kitle

- Kişisel gelişim meraklıları
- Yoğun çalışan profesyoneller
- Öğrenciler
- Yaşam koçları ve terapistler

#Takım No:98

## Sprint 1 Kapsamı

Sprint 1 hedefi temel habit tracker altyapısının çalışmasıdır:

- Kullanıcı kayıt olabilir.
- Kullanıcı giriş yapabilir ve JWT token alabilir.
- Kullanıcı en fazla 3 aktif alışkanlık oluşturabilir.
- Kullanıcı alışkanlıklarını listeleyebilir, güncelleyebilir ve silebilir.
- Kullanıcı günlük "yaptım / yapmadım" check-in kaydı oluşturabilir.

## Önerilen Teknoloji Yapısı

- Backend: FastAPI
- Veritabanı: PostgreSQL/Supabase uyumlu SQLAlchemy modelleri
- Lokal geliştirme: SQLite
- Kimlik doğrulama: JWT
- Şifre güvenliği: bcrypt hash
- İleriki sprintler: AI servis katmanı, RAG/strateji havuzu, dashboard/analitik API'leri

## Backend Kurulumu

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

API çalışınca:

- Health check: `GET http://127.0.0.1:8000/health`
- Swagger dokümantasyonu: `http://127.0.0.1:8000/docs`

## Sprint 1 API'leri

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Habits

- `GET /api/habits`
- `POST /api/habits`
- `PATCH /api/habits/{habit_id}`
- `DELETE /api/habits/{habit_id}`

### Check-ins

- `GET /api/check-ins`
- `POST /api/check-ins`

## Veritabanı Notu

Kalıcı veritabanı için Supabase PostgreSQL kullanılır. `.env` içindeki `DATABASE_URL` değeri Supabase Session Pooler bağlantısı olmalıdır:

```env
DATABASE_URL=postgresql+psycopg://postgres.attrqdzflzbcblygqect:YOUR_DATABASE_PASSWORD@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require
```

Şema değişiklikleri Alembic migration ile yönetilir:

```bash
cd backend
alembic upgrade head
```

Supabase Security Advisor'da görünen RLS uyarıları için uygulama tablolarında Row Level Security migration ile açılır. Backend veritabanına server-side bağlandığı için kullanıcı erişimi FastAPI/JWT katmanında kontrol edilir.
