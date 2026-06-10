import api from "./api";

export const userEndpoints = {
  getCurrentUser: () => api.get("/users"),

  updateUser: (body) => api.patch("/users", body),

  updateUserImage: (body) => api.patch("/users/image", body),

  deleteUserImage: () => api.delete("/users/image"),

  updateUserResume: (body) => api.patch("/users/resume", body),

  deleteUserResume: () => api.delete("/users/resume"),

  deleteUser: () => api.delete("/users"),
};
