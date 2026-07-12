import api, { TOKEN_KEY } from "./api";

const NAME_KEY = "identity_coach_name";

const storeSession = (data) => {
  if (data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }
  if (data.user?.name) {
    localStorage.setItem(NAME_KEY, data.user.name);
  }
};

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  storeSession(response.data);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/api/auth/login", loginData);
  storeSession(response.data);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem(TOKEN_KEY));
};

export const getStoredName = () => {
  return localStorage.getItem(NAME_KEY) || "";
};
