import api from "./api";

export const getOverview = async () => {
  const response = await api.get("/api/stats/overview");
  return response.data;
};

/**
 * Son 7 günün istatistikleri. Tarayıcının yerel tarihi gönderilir ki
 * kullanıcı sunucudan ileri bir saat dilimindeyken "bugün" pencere
 * dışında kalmasın.
 */
export const getWeekly = async (today) => {
  const response = await api.get("/api/stats/weekly", {
    params: today ? { today } : undefined,
  });
  return response.data;
};
