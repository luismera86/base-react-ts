import { api } from "../../../shared/api";

export const loginService = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const logoutService = async () => {
  await api.post('/auth/logout');
};

export const checkAuthService = async (token: string) => {
  const response = await api.get('/auth/check', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};