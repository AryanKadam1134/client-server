import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log("BASE_URL: ", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response.data; // 🔥 THIS LINE FIXES EVERYTHING
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const apiEndpoints = {
  register: (body) => api.post(`/user/register`, body),

  login: (body) => api.post(`/user/login`, body),

  restoreSession: (body) => api.post(`/user/restoreSession`, body),

  logout: () => api.post(`/user/logout`),

  getSocialPlatforms: () => api.get(`/filter/social-platforms`),

  getSkillLevels: () => api.get(`/filter/skill-levels`),
};
