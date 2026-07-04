# Sprint 2 TODO: Görev dağılımı

## Sprint 1 ✅ Tamamlandı
- User auth (register/login/JWT)
- Habit CRUD (max 3 active)
- Check-in (done/missed)
- Alembic migrations
- Integration test

## Sprint 2 🔜 Planlanan

### Backend
| Görev | Dosya | Sorumlu |
|---|---|---|
| LLM soyutlama (base + factory) | `app/llm/` | |
| OpenAI provider | `app/llm/providers/openai.py` | |
| Embedding servisi | `app/rag/embedder.py` | |
| pgvector VectorStore | `app/rag/vector_store.py` | |
| RAG Retriever | `app/rag/retriever.py` | |
| Coach Agent + tools | `app/agents/` | |
| Coach service | `app/services/coach_service.py` | |
| Stats service | `app/services/stats_service.py` | |
| Strategy seed data | `strategies/seed.json` | |
| Stats API endpoint | `app/routers/stats.py` | |
| Coach API endpoint | tracking router'a ekle | |

### Frontend
| Görev | Dosya | Sorumlu |
|---|---|---|
| Proje kurulumu | `package.json`, config | |
| Supabase client | `lib/supabase.ts` | |
| API helper | `lib/api.ts` | |
| Layout + nav | `app/layout.tsx` | |
| Dashboard | `app/page.tsx` | |
| HabitCard | `components/HabitCard.tsx` | |
| CoachPanel | `components/CoachPanel.tsx` | |
| Onboarding | `app/onboarding/page.tsx` | |
| Stats page | `app/stats/page.tsx` | |
