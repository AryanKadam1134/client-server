import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log("BASE_URL: ", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

export const apiEndpoints = {
  getSocialPlatforms: () => api.get(`/filter/social-platforms`),

  getSkillLevels: () => api.get(`/filter/skill-levels`),
};
