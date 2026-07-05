import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);

  if (response.data.access_token) {
    localStorage.setItem("identity_coach_token", response.data.access_token);
  }

  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/api/auth/login", loginData);

  if (response.data.access_token) {
    localStorage.setItem("identity_coach_token", response.data.access_token);
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("identity_coach_token");
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("identity_coach_token"));
};