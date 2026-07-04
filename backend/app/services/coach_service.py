# Sprint 2 TODO: Coach service - EN KRİTİK DOSYA
# Alışkanlık kaçırıldığında devreye giren AI koç akışı:
#
# async def process_failure(db, user, habit_id, log_date, reason_text):
#   1. CheckIn'i bul ve güncelle
#   2. LLM ile reason'ı kategorize et
#   3. Embedding oluştur, FailureReflection kaydet
#   4. Retriever ile uygun stratejileri bul
#   5. CoachAgent ile kişiselleştirilmiş yanıt üret
#   6. CoachInteraction kaydet
#   7. Response dön
