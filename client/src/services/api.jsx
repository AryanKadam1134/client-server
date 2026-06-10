import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
    return Promise.reject(error.response?.data || error);
  },
);

export const apiEndpoints = {
  // Authentication
  googleAuth: (body, config) => api.post(`/auth/google`, body, config),

  register: (body) => api.post(`/auth/register`, body),

  login: (body, config) => api.post(`/auth/login`, body, config),

  logout: () => api.post(`/auth/logout`),

  restoreSession: (config) => api.post(`/auth/restoreSession`, {}, config),

  changePassword: (body) => api.patch(`/auth/password`, body),

  // Forgot Passowrd
  forgotPassword: (body) => api.post(`/auth/forgot-password`, body),

  verifyOTP: (body) => api.post(`/auth/verify-otp`, body),

  resetPassword: (body) => api.patch(`/auth/reset-password`, body),

  // User Details
  checkPassword: () => api.get(`/users/check-password`),

  getCurrentUser: () => api.get("/users"),

  updateUser: (body) => api.patch("/users", body),

  updateUserImage: (body) => api.patch("/users/image", body),

  deleteUserImage: () => api.delete("/users/image"),

  updateUserResume: (body) => api.patch("/users/resume", body),

  deleteUserResume: () => api.delete("/users/resume"),

  deleteUser: () => api.delete("/users"),

  // Social Platfroms
  addSocialPlatform: (body) => api.post(`/socialPlatforms`, body),

  updateSocialPlatform: (platformId, body) =>
    api.patch(`/socialPlatforms/${platformId}`, body),

  deleteSocialPlatform: (platformId) =>
    api.delete(`/socialPlatforms/${platformId}`),

  getSocialPlatform: (platformId) => api.get(`/socialPlatforms/${platformId}`),

  getSocialPlatforms: (params) => api.get(`/socialPlatforms`, { params }),

  // Skills
  addSkill: (body) => api.post(`/skills`, body),

  updateSkill: (skillId, body) => api.patch(`/skills/${skillId}`, body),

  deleteSkill: (skillId) => api.delete(`/skills/${skillId}`),

  getSkill: (skillId) => api.get(`/skills/${skillId}`),

  getSkills: (params) => api.get(`/skills`, { params }),

  // Skill Categories
  addSkillCategory: (body) => api.post(`/skillCategories`, body),

  updateSkillCategory: (categoryId, body) =>
    api.patch(`/skillCategories/${categoryId}`, body),

  deleteSkillCategory: (categoryId) =>
    api.delete(`/skillCategories/${categoryId}`),

  getSkillCategory: (categoryId) => api.get(`/skillCategories/${categoryId}`),

  getSkillCategories: (params) => api.get(`/skillCategories`, { params }),

  // Projects
  addProject: (body) => api.post(`/projects`, body),

  updateProject: (projectId, body) => api.patch(`/projects/${projectId}`, body),

  updateProjectImage: (projectId, body) =>
    api.patch(`/projects/${projectId}/project-images`, body),

  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),

  deleteProjectImage: (projectId, imagePublicId) =>
    api.delete(`/projects/${projectId}/project-images/${imagePublicId}`),

  getProject: (projectId) => api.get(`/projects/${projectId}`),

  getProjects: (params) => api.get(`/projects`, { params }),

  // Experiences
  addExperience: (body) => api.post(`/experiences`, body),

  updateExperience: (experienceId, body) =>
    api.patch(`/experiences/${experienceId}`, body),

  updateOrganizationImage: (experienceId, body) =>
    api.patch(`/experiences/${experienceId}/organization-image`, body),

  deleteExperience: (experienceId) =>
    api.delete(`/experiences/${experienceId}`),

  deleteOrganizationImage: (experienceId) =>
    api.delete(`/experiences/${experienceId}/organization-image`),

  getExperience: (experienceId) => api.get(`/experiences/${experienceId}`),

  getExperiences: (params) => api.get(`/experiences`, { params }),

  // Educations
  addEducation: (body) => api.post(`/educations`, body),

  updateEducation: (educationId, body) =>
    api.patch(`/educations/${educationId}`, body),

  updateInstituteImage: (educationId, body) =>
    api.patch(`/educations/${educationId}/institute-image`, body),

  deleteEducation: (educationId) => api.delete(`/educations/${educationId}`),

  deleteInstituteImage: (educationId) =>
    api.delete(`/educations/${educationId}/institute-image`),

  getEducation: (educationId) => api.get(`/educations/${educationId}`),

  getEducations: (params) => api.get(`/educations`, { params }),

  // Certificates
  addCertificate: (body) => api.post(`/certificates`, body),

  updateCertificate: (certificateId, body) =>
    api.patch(`/certificates/${certificateId}`, body),

  updateCertificateImage: (certificateId, body) =>
    api.patch(`/certificates/${certificateId}/certificate-image`, body),

  deleteCertificate: (certificateId) =>
    api.delete(`/certificates/${certificateId}`),

  deleteCertificateImage: (certificateId) =>
    api.delete(`/certificates/${certificateId}/certificate-image`),

  getCertificate: (certificateId) => api.get(`/certificates/${certificateId}`),

  getCertificates: (params) => api.get(`/certificates`, { params }),

  // Achievements
  addAchievement: (body) => api.post(`/achievements`, body),

  updateAchievement: (achievementId, body) =>
    api.patch(`/achievements/${achievementId}`, body),

  updateAchievementImage: (achievementId, body) =>
    api.patch(`/achievements/${achievementId}/achievement-images`, body),

  deleteAchievement: (achievementId) =>
    api.delete(`/achievements/${achievementId}`),

  deleteAchievementImage: (achievementId, imagePublicId) =>
    api.delete(
      `/achievements/${achievementId}/achievement-images/${imagePublicId}`,
    ),

  getAchievement: (achievementId) => api.get(`/achievements/${achievementId}`),

  getAchievements: (params) => api.get(`/achievements`, { params }),

  // Filters
  getSkillCategoriesList: () => api.get(`/filters/skill-categories`),

  getOrganizationsList: () => api.get(`/filters/organizations`),

  getProjectCategoriesList: () => api.get(`/filters/project-categories`),

  getSkillsList: () => api.get(`/filters/skills`),

  getCertificatesList: () => api.get(`/filters/certificates`),

  getSkillLevels: () => api.get(`/filters/skill-levels`),

  getGenders: () => api.get(`/filters/genders`),

  getEmploymentTypes: () => api.get(`/filters/employment-types`),

  getLocationTypes: () => api.get(`/filters/location-types`),

  getVisibilities: () => api.get(`/filters/visibility`),
};
