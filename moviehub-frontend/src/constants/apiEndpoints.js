export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  MOVIES: {
    BASE: "/movies",
  },
  THEATRES: {
    BASE: "/theatres",
  },
  SCREENS: {
    BASE: "/screens",
  },
  SHOWS: {
    BASE: "/shows",
  },
  SEATS: {
    SCREEN: (screenId) => `/seats/screen/${screenId}`,
  },
  SHOW_SEATS: {
    BASE: "/show-seats",
    GENERATE: (showId) => `/show-seats/generate/${showId}`,
  },
  BOOKINGS: {
    BASE: "/bookings",
  },
  TICKETS: {
    GENERATE: (bookingId) => `/tickets/generate/${bookingId}`,
  }
};
