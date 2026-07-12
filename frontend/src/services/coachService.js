import api from "./api";

/**
 * Kaçırılan alışkanlık için AI koçtan yansıma/öneri ister.
 * @param {{habit_id: string, reason_text: string, check_in_id?: string}} payload
 */
export const reflectOnFailure = async (payload) => {
  const response = await api.post("/api/coach/reflect", payload);
  return response.data;
};

export const getStrategies = async () => {
  const response = await api.get("/api/coach/strategies");
  return response.data;
};
