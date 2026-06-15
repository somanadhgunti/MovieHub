import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const loginUser = async (loginData) => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
  return response.data;
};