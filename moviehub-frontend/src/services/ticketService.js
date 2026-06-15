import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const generateTicket = async (bookingId) => {
  const response = await api.post(API_ENDPOINTS.TICKETS.GENERATE(bookingId));
  return response.data;
};

export const getTicketsByBooking = async (bookingId) => {
  const response = await api.get(`/tickets/booking/${bookingId}`);
  return response.data;
};
