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
  // Authentication
  register: (body) => api.post(`/users/register`, body),

  login: (body, config) => api.post(`/users/login`, body, config),

  restoreSession: (config) => api.post(`/users/restoreSession`, {}, config),

  logout: () => api.post(`/users/logout`),

  // User Details
  getCurrentUser: () => api.get("/users"),

  updateUser: (body) => api.patch("/users", body),

  updateUserImage: (body) => api.patch("/users/image", body),

  deleteUserImage: () => api.delete("/users/image"),

  updateUserResume: (body) => api.patch("/users/resume", body),

  deleteUserResume: () => api.delete("/users/resume"),

  // Social Platfroms
  addSocialPlatform: (body) => api.post(`/socialPlatforms`, body),

  updateSocialPlatform: (platformId, body) =>
    api.patch(`/socialPlatforms/${platformId}`, body),

  deleteSocialPlatform: (platformId) =>
    api.delete(`/socialPlatforms/${platformId}`),

  getSocialPlatform: (platformId) => api.get(`/socialPlatforms/${platformId}`),

  getSocialPlatforms: () => api.get(`/socialPlatforms`),

  // Skills
  addSkill: (body) => api.post(`/skills`, body),

  updateSkill: (skillId, body) => api.patch(`/skills/${skillId}`, body),

  deleteSkill: (skillId) => api.delete(`/skills/${skillId}`),

  getSkill: (skillId) => api.get(`/skills/${skillId}`),

  getSkills: () => api.get(`/skills`),

  // Skill Categories
  addSkillCategory: (body) => api.post(`/skillCategories`, body),

  updateSkillCategory: (categoryId, body) =>
    api.patch(`/skillCategories/${categoryId}`, body),

  deleteSkillCategory: (categoryId) =>
    api.delete(`/skillCategories/${categoryId}`),

  getSkillCategory: (categoryId) => api.get(`/skillCategories/${categoryId}`),

  getSkillCategories: () => api.get(`/skillCategories`),

  // Filters
  getSkillCategoriesFilter: () => api.get(`/filters/skill-categories`),

  getSkillLevels: () => api.get(`/filters/skill-levels`),

  getGenders: () => api.get(`/filters/genders`),

  getEmploymentTypes: () => api.get(`/filters/employment-types`),

  getVisibilities: () => api.get(`/filters/visibility`),
};
