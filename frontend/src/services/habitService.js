import api from "./api";

export const getHabits = async () => {
  const response = await api.get("/api/habits");
  return response.data;
};

export const getHabitById = async (habitId) => {
  const habits = await getHabits();
  return habits.find((habit) => habit.id === habitId);
};

export const createHabit = async (habitData) => {
  const response = await api.post("/api/habits", habitData);
  return response.data;
};

export const updateHabit = async (habitId, updatedData) => {
  const response = await api.patch(`/api/habits/${habitId}`, updatedData);
  return response.data;
};

export const deleteHabit = async (habitId) => {
  await api.delete(`/api/habits/${habitId}`);
};

export const getCheckIns = async () => {
  const response = await api.get("/api/check-ins");
  return response.data;
};

export const createCheckIn = async (checkInData) => {
  const response = await api.post("/api/check-ins", checkInData);
  return response.data;
};