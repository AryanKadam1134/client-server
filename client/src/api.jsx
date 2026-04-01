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

  getCurrentUser: () => api.get("/user"),

  updateUser: (body) => api.patch("/user", body),

  updateUserImage: (body) => api.patch("/user/image", body),

  getSocialPlatforms: () => api.get(`/filter/social-platforms`),

  // Filters
  getSkillLevels: () => api.get(`/filter/skill-levels`),

  getGenders: () => api.get(`/filter/genders`),

  getEmploymentTypes: () => api.get(`/filter/employment-types`),

  getVisibilities: () => api.get(`/filter/visibility`),
};
