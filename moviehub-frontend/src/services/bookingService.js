import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { getTicketsByBooking } from "./ticketService";
import { getAllShows, getShowSeatLayout } from "./showService";

export const createBooking = async (bookingData) => {
  const response = await api.post(API_ENDPOINTS.BOOKINGS.BASE, bookingData);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get(API_ENDPOINTS.BOOKINGS.BASE);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.BOOKINGS.BASE}/${id}`);
  return response.data;
};

export const getBookingsByUser = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.BOOKINGS.BASE}/user/${userId}`);
  return response.data;
};

export const cancelBooking = async (bookingId, reason) => {
  const response = await api.post(`${API_ENDPOINTS.BOOKINGS.BASE}/${bookingId}/cancel`, { reason });
  return response.data;
};

export const resolveBookings = async (bookings) => {
  if (!bookings || bookings.length === 0) return [];

  try {
    // 1. Fetch all shows once to optimize
    const shows = await getAllShows();
    const showsList = shows.content || shows || [];

    // 2. Fetch layouts for all active shows in parallel to match seat mappings
    const showSeatLayouts = {};
    await Promise.all(
      showsList.map(async (show) => {
        try {
          const layout = await getShowSeatLayout(show.id);
          showSeatLayouts[show.id] = { show, layout };
        } catch (err) {
          // ignore layout failure for offline shows
        }
      })
    );

    // 3. Map each booking response back to its tickets and show coordinates
    const resolved = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const tickets = await getTicketsByBooking(booking.bookingId);
          if (!tickets || tickets.length === 0) {
            return {
              ...booking,
              id: booking.bookingId,
              movieTitle: "N/A",
              theatreName: "N/A",
              screenNumber: "N/A",
              showDate: "N/A",
              showTime: "N/A",
              seats: []
            };
          }

          const firstTicket = tickets[0];
          const targetShowSeatId = firstTicket.showSeatId;

          // Find show container matching targetShowSeatId
          let matchedShow = null;
          let matchedLayout = null;

          for (const showId in showSeatLayouts) {
            const { show, layout } = showSeatLayouts[showId];
            if (layout.some((s) => s.id === targetShowSeatId)) {
              matchedShow = show;
              matchedLayout = layout;
              break;
            }
          }

          if (!matchedShow) {
            return {
              ...booking,
              id: booking.bookingId,
              movieTitle: "N/A",
              theatreName: "N/A",
              screenNumber: "N/A",
              showDate: "N/A",
              showTime: "N/A",
              seats: []
            };
          }

          const bookingSeats = tickets.map((t) => {
            const seatObj = matchedLayout.find((s) => s.id === t.showSeatId);
            return seatObj ? { ...seatObj.seat, showSeatId: seatObj.id } : null;
          }).filter(Boolean);

          return {
            id: booking.bookingId,
            bookingId: booking.bookingId,
            bookingNumber: booking.bookingNumber,
            totalSeats: booking.totalSeats,
            totalAmount: booking.totalAmount,
            bookingStatus: booking.bookingStatus,
            cancellationReason: booking.cancellationReason,
            movieTitle: matchedShow.movie?.title,
            moviePosterUrl: matchedShow.movie?.posterUrl,
            language: matchedShow.movie?.language,
            genre: matchedShow.movie?.genre,
            theatreName: matchedShow.screen?.theatre?.name,
            theatreCity: matchedShow.screen?.theatre?.city,
            screenNumber: matchedShow.screen?.screenNumber,
            showDate: matchedShow.showDate,
            showTime: matchedShow.startTime,
            seats: bookingSeats,
            tickets: tickets
          };
        } catch (bookingErr) {
          console.error("Failed to resolve booking meta:", bookingErr);
          return {
            ...booking,
            id: booking.bookingId,
            movieTitle: "N/A",
            theatreName: "N/A",
            screenNumber: "N/A",
            showDate: "N/A",
            showTime: "N/A",
            seats: []
          };
        }
      })
    );

    return resolved;
  } catch (err) {
    console.error("Bulk resolve bookings failed:", err);
    return bookings.map(b => ({
      ...b,
      id: b.bookingId,
      movieTitle: "N/A",
      theatreName: "N/A",
      screenNumber: "N/A",
      showDate: "N/A",
      showTime: "N/A",
      seats: []
    }));
  }
};
