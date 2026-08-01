import api from "./api";

export const userEndpoints = {
  getCurrentUser: () => api.get("/users"),

  updateUser: (body) => api.patch("/users", body),

  deleteUser: () => api.delete("/users"),

  getUserImage: () => api.get("/users/image"),

  updateUserImage: (body) => api.patch("/users/image", body),

  deleteUserImage: () => api.delete("/users/image"),

  getUserResume: () => api.get("/users/resume"),

  updateUserResume: (body) => api.patch("/users/resume", body),

  deleteUserResume: () => api.delete("/users/resume"),
};
