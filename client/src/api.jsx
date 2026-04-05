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

  // User Details
  getCurrentUser: () => api.get("/user"),

  updateUser: (body) => api.patch("/user", body),

  updateUserImage: (body) => api.patch("/user/image", body),

  deleteUserImage: () => api.delete("/user/image"),

  updateUserResume: (body) => api.patch("/user/resume", body),

  deleteUserResume: () => api.delete("/user/resume"),

  // Social Account
  manageUserSocialPlatforms: (body) => api.post(`/social/manage`, body),

  addSocialPlatform: (body) => api.post(`/social`, body),

  updateSocialPlatform: (accountId, body) =>
    api.patch(`/social/${accountId}`, body),

  deleteSocialPlatform: (accountId) => api.delete(`/social/${accountId}`),

  getSocialPlatforms: () => api.get(`/social`),

  // Skills
  addSkill: (body) => api.post(`/skill`, body),

  updateSkill: (skillId, body) => api.patch(`/skill/${skillId}`, body),

  deleteSkill: (skillId) => api.delete(`/skill/${skillId}`),

  getSkills: () => api.get(`/skill`),

  // Skill Categories
  getSkillCategories: () => api.get(`/skillCategory`),

  // Filters
  getSkillLevels: () => api.get(`/filter/skill-levels`),

  getGenders: () => api.get(`/filter/genders`),

  getEmploymentTypes: () => api.get(`/filter/employment-types`),

  getVisibilities: () => api.get(`/filter/visibility`),
};
