import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Shows
export const getAllShows = async (params = {}) => {
  const response = await api.get(API_ENDPOINTS.SHOWS.BASE, { params });
  return response.data;
};

export const getShowById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.SHOWS.BASE}/${id}`);
  return response.data;
};

export const createShow = async (showData) => {
  const response = await api.post(API_ENDPOINTS.SHOWS.BASE, showData);
  return response.data;
};

export const updateShow = async (id, showData) => {
  const response = await api.put(`${API_ENDPOINTS.SHOWS.BASE}/${id}`, showData);
  return response.data;
};

export const deleteShow = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.SHOWS.BASE}/${id}`);
  return response.data;
};

// Client-side filtering helper using only standard GET /shows
export const getShowsByMovie = async (movieId) => {
  const allShows = await getAllShows();
  const showsList = allShows.content || allShows || [];
  return showsList.filter(
    (show) =>
      show.movieId === parseInt(movieId) ||
      show.movie?.id === parseInt(movieId)
  );
};

// Show Seats Layout Mapping
export const getShowSeatLayout = async (showId) => {
  const response = await api.get(`${API_ENDPOINTS.SHOW_SEATS.BASE}/${showId}`);
  return response.data;
};

export const getShowSeats = async (showId) => {
  const response = await api.get(`${API_ENDPOINTS.SHOW_SEATS.BASE}/${showId}`);
  return response.data;
};

export const generateShowSeats = async (showId) => {
  const response = await api.post(API_ENDPOINTS.SHOW_SEATS.GENERATE(showId));
  return response.data;
};

// Client-side local seat locking simulation
export const lockSeats = async (lockData) => {
  return { message: "Seats locked client-side temporarily." };
};
