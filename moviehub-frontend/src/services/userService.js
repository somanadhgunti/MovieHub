import api from "./api";

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserStatus = async (id, enabled) => {
  const response = await api.put(`/users/${id}/status`, null, {
    params: { enabled }
  });
  return response.data;
};

export const updateProfile = async (id, profileData) => {
  const response = await api.put(`/users/${id}`, profileData);
  return response.data;
};

export const changePassword = async (id, passwordData) => {
  const response = await api.put(`/users/${id}/change-password`, passwordData);
  return response.data;
};

export const userService = {
  getAllUsers,
  updateUserStatus,
  updateProfile,
  changePassword,
};

export default userService;
