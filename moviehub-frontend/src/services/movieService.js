import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getAllMovies = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.MOVIES.BASE, { params });
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.MOVIES.BASE}/${id}`);
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post(API_ENDPOINTS.MOVIES.BASE, movieData);
  return response.data;
};

export const updateMovie = async (id, movieData) => {
  const response = await api.put(`${API_ENDPOINTS.MOVIES.BASE}/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.MOVIES.BASE}/${id}`);
  return response.data;
};