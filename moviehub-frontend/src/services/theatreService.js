import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Theatres
export const getAllTheatres = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.THEATRES.BASE, { params });
  return response.data;
};

export const getTheatreById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.THEATRES.BASE}/${id}`);
  return response.data;
};

// Screens
export const getAllScreens = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.SCREENS.BASE, { params });
  return response.data;
};

export const getScreenById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.SCREENS.BASE}/${id}`);
  return response.data;
};

// Seats Template
export const getScreenSeatTemplate = async (screenId) => {
  const response = await api.get(API_ENDPOINTS.SEATS.SCREEN(screenId));
  return response.data;
};

// Theatre CRUD
export const createTheatre = async (theatreData) => {
  const response = await api.post(API_ENDPOINTS.THEATRES.BASE, theatreData);
  return response.data;
};

export const updateTheatre = async (id, theatreData) => {
  const response = await api.put(`${API_ENDPOINTS.THEATRES.BASE}/${id}`, theatreData);
  return response.data;
};

export const deleteTheatre = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.THEATRES.BASE}/${id}`);
  return response.data;
};

// Screen CRUD
export const createScreen = async (screenData) => {
  const response = await api.post(API_ENDPOINTS.SCREENS.BASE, screenData);
  return response.data;
};

export const updateScreen = async (id, screenData) => {
  const response = await api.put(`${API_ENDPOINTS.SCREENS.BASE}/${id}`, screenData);
  return response.data;
};

export const deleteScreen = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.SCREENS.BASE}/${id}`);
  return response.data;
};
