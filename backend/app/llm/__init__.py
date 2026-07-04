# Sprint 2 TODO: LLM soyutlama katmanı
# BaseLLM (ABC): async chat(messages, tools=None, temperature=0.7)
# BaseEmbedder (ABC): async embed(texts) -> list[list[float]]
#
# Factory:
# get_llm() -> BaseLLM (config.LLM_PROVIDER'a göre)
# get_embedder() -> BaseEmbedder
#
# Desteklenen provider'lar: openai, claude, ollama
